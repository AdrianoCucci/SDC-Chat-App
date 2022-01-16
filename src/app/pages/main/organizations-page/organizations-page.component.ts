import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Organization } from 'src/app/core/models/organizations/organization';
import { OrganizationsService } from 'src/app/core/services/api/organizations-service';
import { parseHttpError } from 'src/app/shared/functions/parse-http-error';
import { PagedList } from 'src/app/shared/models/pagination/paged-list';

@Component({
  selector: 'app-organizations-page',
  templateUrl: './organizations-page.component.html',
  styleUrls: ['./organizations-page.component.scss']
})
export class OrganizationsPage implements OnInit {
  public loadingVisible: boolean = false;
  public loadError: string;
  public errorVisible: boolean = false;

  private _organizations: PagedList<Organization>;

  constructor(private _orgsService: OrganizationsService) { }

  async ngOnInit(): Promise<void> {
    try {
      this.loadingVisible = true;

      const response: HttpResponse<PagedList<Organization>> = await this._orgsService.getAllOrganizations().toPromise();
      this._organizations = response.body;
    }
    catch(error) {
      this.loadError = parseHttpError(error as HttpErrorResponse, true) as string;
      this.errorVisible = true;
    }
    finally {
      this.loadingVisible = false;
    }
  }

  public get organizations(): PagedList<Organization> {
    return this._organizations;
  }
}