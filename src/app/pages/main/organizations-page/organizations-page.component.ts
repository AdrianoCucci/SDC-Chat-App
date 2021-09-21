import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-organizations-page',
  templateUrl: './organizations-page.component.html',
  styleUrls: ['./organizations-page.component.scss']
})
export class OrganizationsPage implements OnInit {
  public loadingVisible: boolean = false;
  public loadError: string;
  public errorVisible: boolean = false;
  
  constructor() { }

  ngOnInit(): void {
  }

}
