import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonHeader, IonButton, IonTitle, IonToolbar, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [RouterModule, IonIcon, IonInput, IonLabel, IonItem, IonCol, IonRow, IonGrid, IonContent, IonHeader, IonButton],
})
export class LoginPage implements OnInit {

  private router = inject(Router);

  constructor() { }

  ngOnInit() {
  }


  login() {
    console.log('Botão de login clicado!');

  }

  goToCadastro() {
  this.router.navigate(['/cadastro']);
}

}