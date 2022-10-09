import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LogService } from '../services/log.service';
import { OperationResponse } from '../models/response.model';
import { Appointment } from '../models/appointment.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private scannerEnabled: boolean = true;
  private transports: Transport[] = [];
  private information: string = "Nenhuma informação de código detectada. Amplie um código QR para digitalizar.";

  public numeroQrCode: any;
  public numeroCartao: any;
  public pin: any;
  public foto: any;

  constructor(
    private http: HttpClient,
    private logService: LogService,
    private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  public scanSuccessHandler($event: any) {
    this.scannerEnabled = false;
    this.information = "Aguarde recuperando informações... ";

    this.numeroQrCode = $event;
    var teste = this.numeroQrCode.split("@@");
    this.numeroCartao = teste[0].substr(teste[0].length - 10);

    this.http.get(`https://desktop-drttrdq:14052/api/v1/Identificadores/${this.numeroCartao}`).subscribe(
      (x: any) => {
        this.pin = x.pin;
        this.http.get(`https://desktop-drttrdq:14052/api/v1/Fotos/base64?id=${x.pin}`).subscribe(
          (x: any) => this.foto = x,
          (e)=> console.error(e)
        );
      },
      (e) => console.error(e)
    )

    //const appointment = new Appointment($event);
    //this.logService.logAppointment(appointment).subscribe(
    //  (result: OperationResponse) => {
    //    this.information = $event;
    //    this.transports = result.object;
    //    this.cd.markForCheck();
    //  },
    //  (error: any) => {
    //    this.information = "Ocorreu um erro, por favor, tente novamente ... ";
    //    this.cd.markForCheck();
    //  });
  }

  public enableScanner() {
    this.scannerEnabled = !this.scannerEnabled;
    this.information = "Nenhuma informação de código detectada. Aumente o zoom em um código QR para digitalizar.";
  }

}

interface Transport {
  plates: string;
  slot: Slot;
}

interface Slot {
  name: string;
  description: string;
}
