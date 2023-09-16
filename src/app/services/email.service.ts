import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) { }

  sendInqueryMail (userName: string, userAddress: string, subject: string, body: string)
  : Observable<any>
  {    
    let parameters = new HttpParams({
      fromObject: {
        userName: userName,
        userAddress: userAddress,
        subject: subject,
        body: body,
      }
    });

    return this.http.get(this.baseUrl + 'api/Email/SendInqueryMail',{params: parameters});
  }
}

export class email
{
  userName: string;
  userAddress: string;
  subject: string;
  body: string;
}

export enum emailingStatus {
  newMail = "newMail",
  sending = "sending",
  sent = "sent",
  failed = "failed",
}