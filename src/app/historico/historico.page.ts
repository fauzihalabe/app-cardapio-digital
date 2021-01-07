import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../providers/firebase';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
})
export class HistoricoPage implements OnInit {

  pedidos = [];

  constructor(
    public firebase: FirebaseService,
    public modalController: ModalController
  ) { }

  fechar() {
    this.modalController.dismiss();
  }

  async ngOnInit() {
    //Recuperar detalhes dos pedidos
    let items = JSON.parse(localStorage.getItem('historicoPedidos'));
    if (items) {
      items.forEach(async item => {
        this.firebase.pedido(item).then((r) => {
          this.pedidos.push(r)
        })
      });
    }
  }

}
