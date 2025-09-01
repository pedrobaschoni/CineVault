import { Component, OnInit } from '@angular/core';
import { IonHeader, IonButton, IonTitle, IonToolbar, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonIcon, IonInput, IonLabel, IonItem, IonCol, IonRow, IonGrid, IonContent, IonHeader, IonButton],
})
export class LoginPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }


  login() {
    console.log('Botão de login clicado!');

  }

}