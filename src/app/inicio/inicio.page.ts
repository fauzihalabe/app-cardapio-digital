import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../providers/firebase';
import { LoadingController, ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page'

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  loaded: boolean = false;
  categorias = [];

  constructor(
    public firebase: FirebaseService,
    public loadingController: LoadingController,
    public modalController: ModalController
  ) { }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Carregando...',
    });
    await loading.present();

    //Inicilizar e recuperar configs
    this.firebase.iniciar().then(async () => {
      await loading.dismiss();
      this.loaded = true;
    });

    //Carregar categorias
    this.firebase.categorias()
      .then(async (data) => {
        this.categorias = data;
        let i = 0;
        for (i; i < this.categorias.length; i++) {
         let produtos = await this.firebase.produtosPorCategoria(this.categorias[i]['id']);
         this.categorias[i]['produtos'] = produtos;
        }
      })
  }

  async detalhesDoProduto(p) {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        "produto": p
      }
    });
    return await modal.present();
  }

}
