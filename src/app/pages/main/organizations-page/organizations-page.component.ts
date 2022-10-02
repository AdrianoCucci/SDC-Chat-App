import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { defer, Observable, throwError } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { Organization } from 'src/app/core/models/organizations/organization';
import { OrganizationsService } from 'src/app/core/services/api/organizations-service';
import { parseErrorMessage } from 'src/app/shared/functions/parse-http-error';
import { PagedList } from 'src/app/shared/models/pagination/paged-list';
import { Paginatable } from 'src/app/shared/models/pagination/paginatable';
import { PageEvent } from 'src/app/shared/modules/table/page-event';

@Component({
  selector: 'app-organizations-page',
  templateUrl: './organizations-page.component.html',
  styleUrls: ['./organizations-page.component.scss'],
})
export class OrganizationsPage implements OnInit {
  public readonly pageHandler = (
    event: PageEvent
  ): Observable<PagedList<Organization>> =>
    this.loadOrganizations({
      take: event.limit,
      skip: event.offset * event.limit,
    });

  public loadingVisible: boolean = false;
  public loadError: string;
  public errorVisible: boolean = false;

  private _organizations: PagedList<Organization>;

  constructor(private _orgsService: OrganizationsService) {}

  ngOnInit(): void {
    this.loadOrganizations().subscribe();
  }

  private loadOrganizations(
    pagination?: Paginatable
  ): Observable<PagedList<Organization>> {
    return defer((): Observable<PagedList<Organization>> => {
      this.loadingVisible = true;
      this.errorVisible = false;

      return this._orgsService
        .getAllOrganizations({
          skip: pagination?.skip,
          take: pagination?.take,
        })
        .pipe(
          finalize(() => (this.loadingVisible = false)),
          catchError((error: any) => {
            this.loadError = parseErrorMessage(error);
            this.errorVisible = true;

            return throwError(error);
          }),
          map((value: HttpResponse<PagedList<Organization>>) => value.body),
          tap((value: PagedList<Organization>) => (this._organizations = value))
        );
    });
  }

  public get organizations(): PagedList<Organization> {
    return this._organizations;
  }
}
