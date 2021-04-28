import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginService } from './shared';
import { FireService } from './services/fire.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Finanças dos Bichos';
  usuario: string;

  constructor(
    public dialog: MatDialog,
    public loginService: LoginService,
    private fire: FireService
    ) {}

  ngOnInit(): void {
    if (this.loginService.login()) {
      this.usuario = this.loginService.usuario;
    } else {
      this.usuario = 'Convidado';
      this.editarUsuario();
    }
  }

  editarUsuario(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: {usuario: this.usuario}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.usuario == 'Convidado') {
          alert("Escolha um nome de usuário!");
          this.editarUsuario();
        }
        else  {
          this.loginService.obterUsuario(result.usuario).subscribe(z => {
            let ret = null;
            try { ret = z.data(); } catch {}
            if (this.loginService.cadastrar(result, ret) == false) {
              alert("Senha incorreta!");
              this.editarUsuario();
            } else {
              this.usuario = result.usuario;
              this.fire.obterTudo();
            }
          });
        }
      }
    });
  }
  // obtem tudo da nuvem novamente
  refreshDados() {
    this.fire.obterTudo();
  }
}

export interface LoginData {
  usuario: string;
  senha: string;
}

@Component({
  selector: 'dialog-login',
  templateUrl: 'shared/dialog-login.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: LoginData) {}

  fechar(): void {
    this.dialogRef.close();
  }

  limpar() {
    if (this.data.usuario == 'Convidado')
      this.data.usuario = '';
  }
}
