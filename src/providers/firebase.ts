import { Injectable } from "@angular/core";
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {

    config;
    carrinho = [];

    constructor(
        private afs: AngularFirestore,
        private afAuth: AngularFireAuth
    ) { }

    iniciar() {
        return new Promise<any>((resolve, reject) => {
            //Login anonimo
            this.afAuth.signInAnonymously().then(() => {
                //Recuperar configurações
                this.afs.firestore.collection('config').doc('config').get().then((r) => {
                    //Atribuir a variavel global (para recuperarmos de outras paginas)
                    this.config = r.data();
                    resolve(this.config);
                })
            })
        })
    }

    categorias() {
        return new Promise<any>((resolve, reject) => {
            //Recuperar categorias
            this.afs.firestore.collection('categorias').get().then((lista) => {
                let array = [];
                lista.forEach((item) => {
                    //Formatar dado
                    let obj = item.data();
                    obj['id'] = item.id;
                    array.push(obj);
                });

                resolve(array)
            })
        })
    }

    produtosPorCategoria(categoriaId) {
        return new Promise<any>((resolve, reject) => {
            //Recuperar categorias
            this.afs.firestore.collection('produtos').where('categoria', '==', categoriaId).get().then((lista) => {
                let array = [];
                lista.forEach((item) => {
                    //Formatar dado
                    let obj = item.data();
                    obj['id'] = item.id;
                    array.push(obj);
                });

                resolve(array)
            })
        })
    }

    pedir(pedido) {
        return new Promise<any>((resolve, reject) => {
            //Recuperar categorias
            this.afs.firestore.collection('pedidos').add(pedido)
            .then((r) => {
                resolve(r.id)
            })
            .catch((e) => {
                reject(e)
            })     
        })
    }

    pedido(id){
        return new Promise<any>((resolve, reject) => {
            //Recuperar categorias
            this.afs.firestore.collection('pedidos').doc(id).get()
            .then((r) => {
                resolve(r.data())
            })
            .catch((e) => {
                reject(e)
            })     
        })
    }


}