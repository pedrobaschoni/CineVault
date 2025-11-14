import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

// Importe os componentes do Ionic necessários para o menu
import { 
  IonApp, 
  IonMenu, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItem, 
  IonIcon, 
  IonLabel, 
  IonRouterOutlet,
  IonAvatar,
  IonSplitPane,
  IonButtons,
  IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons'; // Função para registrar ícones
import { homeOutline, filmOutline, tvOutline, starOutline, listOutline, settingsOutline, logOutOutline } from 'ionicons/icons';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonApp, 
    IonMenu, 
    IonHeader, 
    IonToolbar, 
    IonContent, 
    IonList, 
    IonItem, 
    IonIcon, 
    IonLabel, 
    IonRouterOutlet,
    IonAvatar,
    IonSplitPane,
    IonButtons,
    IonButton
  ],
})
export class AppComponent {
  // Lista de páginas que aparecerá no menu
  public appPages = [
    { title: 'Início', url: '/home', icon: 'home-outline' },
    { title: 'Filmes', url: '/movies', icon: 'film-outline' },
    { title: 'Séries', url: '/series', icon: 'tv-outline' },
    { title: 'Minha Lista', url: '/my-list', icon: 'list-outline' },
    { title: 'Gêneros', url: '/genres', icon: 'star-outline' },
    { title: 'Configurações', url: '/settings', icon: 'settings-outline' }
  ];

  @ViewChild('menu') menu: any;

  constructor(private router: Router) {
    // Registra os ícones para que possam ser usados
    addIcons({ homeOutline, filmOutline, tvOutline, starOutline, listOutline, settingsOutline, logOutOutline });
  }

  logout() {
    // Adicione sua lógica de logout aqui
    console.log('Usuário deslogado!');
    this.router.navigate(['/login']); // Exemplo: redireciona para a tela de login
  }

  closeMenu() {
    this.menu?.close();
  }
}