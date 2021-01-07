import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FirebaseService } from '../providers/firebase';
import { CarrinhoPage } from './carrinho/carrinho.page';
import { HistoricoPage } from './historico/historico.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public firebase: FirebaseService,
    public modalController: ModalController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  async carrinho(){
    const modal = await this.modalController.create({
      component: CarrinhoPage,
    });
    return await modal.present();
  }

  async pedidos(){
    const modal = await this.modalController.create({
      component: HistoricoPage,
    });
    return await modal.present();
  }

  ngOnInit() {
   
  }
}
