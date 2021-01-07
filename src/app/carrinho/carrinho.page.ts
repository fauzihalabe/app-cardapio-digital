import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { FirebaseService } from '../../providers/firebase'
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
})
export class CarrinhoPage implements OnInit {

  total = 0;
  step = 0;
  cliente = {
    nome: null,
    cep: null,
    rua: null,
    bairro: null,
    cidade: null,
    complemento: "",
    numero: null,
    troco: "",
    pagamentos: [
     {
       "titulo": 'Dinheiro',
       "checked": false
     },
     {
      "titulo": 'Débito',
      "checked": false
    },
    {
      "titulo": 'Crédito',
      "checked": false
    },
    ]
  }

  constructor(
    public modalController: ModalController,
    public firebase: FirebaseService,
    public toastController: ToastController,
    public alertController: AlertController,
    private http: HttpClient,
    public loadingController: LoadingController
  ) { 

    //Total
    this.firebase.carrinho.forEach((item) => {
      this.total = this.total + (item.preco * item.quantidade);
    })
  }

  deixarApenasUmMarcado(index) {
    let i = 0;
    for (i; i < this.cliente.pagamentos.length; i++) {
      if(i != index){
        this.cliente.pagamentos[i].checked = false;
      }
    }
  }

  ngOnInit() {
  }

  fechar() {
    if(this.step > 0){
      this.step = 0;
    }
    else {
      this.modalController.dismiss();
    }
  }

  async remover(i) {
    const alert = await this.alertController.create({
      header: 'Quer mesmo remover esse item?',
      message: 'Essa ação não pode ser desfeita.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          }
        }, {
          text: 'Remover',
          handler: () => {
            this.firebase.carrinho.splice(i, 1);

            //Atualizar total
            this.firebase.carrinho.forEach((item) => {
              this.total = this.total + (item.preco * item.quantidade);
            })
          }
        }
      ]
    });

    await alert.present();
  }

  finalizar(){
    this.step = 1;
  }

  calcularCep(){
    if(this.cliente.cep.length > 7){
      this.http.get('https://viacep.com.br/ws/' + this.cliente.cep + '/json/').subscribe((r) => {
        console.log(r)
        this.cliente.bairro = r['bairro'];
        this.cliente.rua = r['logradouro'];
        this.cliente.cidade = r['localidade']
      })
    }
  }

  //Finalizar pedido
  async enviar(){
    if(this.cliente.nome && this.cliente.cep){
      let pedido = {
        cliente: this.cliente,
        itens: this.firebase.carrinho,
        status: 'aguardando',
        data: new Date(),
        total: this.total
      };

      const alert = await this.alertController.create({
        header: 'Deseja finalizar o pedido?',
        message: 'O estabelecimento receberá sua solicitação.',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
            }
          }, {
            text: 'Fazer pedido',
            handler: async () => {
              const loading = await this.loadingController.create({
                message: 'Finalizando...',
              });
              await loading.present();

              
              //Enviar para o firebase
              this.firebase.pedir(pedido)
              .then(async (id) => {
                
                //Adicionar no localstorage
                let historicoPedidos = JSON.parse(localStorage.getItem('historicoPedidos'));
                if(!historicoPedidos) {
                  historicoPedidos = [];
                  historicoPedidos.push(id);
                  localStorage.setItem('historicoPedidos', JSON.stringify(historicoPedidos));
                }
                else {
                  historicoPedidos.push(id);
                  localStorage.setItem('historicoPedidos', JSON.stringify(historicoPedidos));
                }

                const toast = await this.toastController.create({
                  message: 'Tudo certo! Você pode acompanhar tudo na aba Meus Pedidos',
                  duration: 2000
                });
                toast.present();
            
                //Voltar para home
                await loading.dismiss();
                this.firebase.carrinho = []
                this.step = 0;
                this.fechar();
              })
              .catch(async () => {
                await loading.dismiss();

                const alert = await this.alertController.create({
                  header: 'Ops!',
                  message: 'Algo deu errado. Por favor, tente novamente.',
                  buttons: [
                    {
                      text: 'Voltar',
                      role: 'cancel',
                      handler: () => {
                      }
                    }
                  ]
                });
            
                await alert.present();
              })
              
            }
          }
        ]
      });
  
      await alert.present();

    }
    else {
      const alert = await this.alertController.create({
        header: 'Ops!',
        message: 'Por favor, preencha todos os campos.',
        buttons: [
          {
            text: 'Entendi',
            role: 'cancel',
            handler: () => {
            }
          }
        ]
      });
  
      await alert.present();
    }
  }
}
