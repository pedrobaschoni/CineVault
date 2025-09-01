import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCol, IonRow, IonGrid, IonItem, IonLabel, IonInput, IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonInput, IonLabel, IonItem, IonGrid, IonRow, IonCol, IonContent, IonHeader, CommonModule, FormsModule]
})
export class CadastroPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  cadastrar() {
    console.log('Botão de cadastrar (com email/senha) clicado!');
  }

  cadastrarComGoogle() {
    console.log('Botão de cadastrar com o Google clicado!');

  }

}
