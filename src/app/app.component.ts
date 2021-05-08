import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
        if (result.usuario == '') {
          alert("Digite seu usuário!");
          this.editarUsuario();
        }
        else if (result.senha == '') {
          alert("Digite sua senha!");
          this.editarUsuario();
        }
        else  {
          this.loginService.obterUsuario(result.usuario).subscribe(z => {
            let dados = null;
            try { dados = z.data(); } catch {}
            let ret = this.loginService.cadastrar(result, dados);
            if (ret == -1)
              this.editarUsuario();
            else if (ret == 0) {
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
export class DialogOverviewExampleDialog implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: LoginData) {}

  public loginForm: FormGroup;

  ngOnInit() {
    this.loginForm = new FormGroup({
      usuario: new FormControl('', [Validators.required]),
      senha: new FormControl('', [Validators.required])
    });
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.loginForm.controls[controlName].hasError(errorName);
  }

  fechar(): void {
    this.dialogRef.close();
  }

  limpar() {
    if (this.data.usuario == 'Convidado')
      this.data.usuario = '';
  }
}
