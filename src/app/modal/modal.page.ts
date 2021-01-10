import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { FirebaseService } from '../../providers/firebase';
import { CarrinhoPage } from '../carrinho/carrinho.page';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  produto;
  quantidade = 1;
  obs: string = '';

  constructor(
    public modalController: ModalController,
    public firebase: FirebaseService,
    private navParams: NavParams,
    public toastController: ToastController
  ) {
    this.produto = this.navParams.get('produto');
  }

  ngOnInit() {
  }

  fechar() {
    this.modalController.dismiss();
  }

  async adicionarAoCarrinho() {
    //Validar se precisa selecionar uma opção
    if (this.produto.variacoes.length > 0) {
      let itemChecked = false;
      this.produto.variacoes.forEach(item => {
        if (item.checked) {
          itemChecked = true;
        }
      });

      if (itemChecked) {
        this.finalizarAdicao();
      }
      else {
        const toast = await this.toastController.create({
          message: 'Ops! Você precisa selecionar uma opção antes de continuar',
          duration: 2000
        });
        toast.present();
      }
    }

    else {
      this.finalizarAdicao()
    }


  }

  async finalizarAdicao() {
    this.produto['quantidade'] = this.quantidade;
    this.produto['obs'] = this.obs;
    this.firebase.carrinho.push(this.produto);
    this.fechar();

    const toast = await this.toastController.create({
      message: this.produto.titulo + ' foi adicionado no seu carrinho!',
      duration: 2000
    });
    toast.present();

    const modal = await this.modalController.create({
      component: CarrinhoPage,
    });
    return await modal.present();
  }

  adicionar() {
    this.quantidade = this.quantidade + 1
  }

  remover() {
    if (this.quantidade > 1) {
      this.quantidade = this.quantidade - 1
    }
  }

  deixarApenasUmMarcado(index) {
    let i = 0;
    for (i; i < this.produto.variacoes.length; i++) {
      if(i != index){
        this.produto.variacoes[i].checked = false;
      }
    }
  }


  recalcularTotal(i){
    if(this.produto.adicionais[i].checked){
      this.produto.preco = this.produto.preco + this.produto.adicionais[i].preco
    }
    else {
      this.produto.preco = this.produto.preco - this.produto.adicionais[i].preco
    }
  }

}
