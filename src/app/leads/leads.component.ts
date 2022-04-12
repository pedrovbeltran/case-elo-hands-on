import { Component, OnInit } from '@angular/core';

import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { Router } from '@angular/router';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css'],
})
export class LeadsComponent implements OnInit {
  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // Configurando os Leads de exemplo previamente
  leads = [
    {
      name: 'Org. Internacionais',
      phone: 'XX912345678',
      email: 'orginter@elogroup.com.br',
      table: ['RPA'],
      status: 0,
    },
    {
      name: 'Ind. Farm. Ltda',
      phone: 'XX912345678',
      email: 'indfarm@elogroup.com.br',
      table: ['Analytics'],
      status: 1,
    },
    {
      name: 'Musc. Live Cmp',
      phone: 'XX912345678',
      email: 'musclive@elogroup.com.br',
      table: ['BPM'],
      status: 0,
    },
  ];

  success: string;
  dragNotAllowed: boolean;
  ngOnInit() {
    if (sessionStorage.getItem('user') == null) {
      alert('Faça login para acessar essa página');
      this.router.navigate(['']);
    }
    this.titleService.setTitle('Painel de Leads');
    this.success = this.route.snapshot.paramMap.get('success');
    if (localStorage.getItem('leads') == null) {
      // Se os Leads de exemplo não estiverem armazenados no localStorage, ale serão armazenados
      localStorage.setItem('leads', JSON.stringify(this.leads));
    } else if (localStorage.getItem('newLeads') !== null) {
      // Pega primeiro, se existir, os leads novos
      // Pega os novos Leads e adicionam nos Leads já existentes no localStorage
      this.leads = JSON.parse(localStorage.getItem('newLeads'));
      this.leads = this.leads.concat(JSON.parse(localStorage.getItem('leads')));
      localStorage.setItem('leads', JSON.stringify(this.leads));
      localStorage.removeItem('newLeads');
    } else {
      this.leads = JSON.parse(localStorage.getItem('leads'));
    }
  }
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousIndex !== event.currentIndex) {
      if (
        (event.previousIndex == 0 && event.currentIndex == 2) ||
        event.previousIndex > event.currentIndex
      ) {
        // Evita que operações não permitidas aconteçam
        this.dragNotAllowed = true;
      } else {
        // Se uma operação é permitida, faça as alterações no vetor e atualize o localStorage
        this.dragNotAllowed = false;
        this.leads[event.item.data].status = event.currentIndex;
        let first = this.leads[event.item.data];
        this.leads.sort(function (x, y) {
          return x == first ? -1 : y == first ? 1 : 0;
        });
        localStorage.setItem('leads', JSON.stringify(this.leads));
      }
    }
  }
}
