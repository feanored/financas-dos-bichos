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
  ) { }

  ngOnInit(): void {
    if (this.loginService.login()) {
      this.usuario = this.loginService.usuario;
    } else {
      this.usuario = 'Convidado';
      this.editarUsuario();
    }
  }

  calculadora(): void {
    const dialogRef = this.dialog.open(CalculatorDialog, {
      width: '265px',
      data: { usuario: this.usuario }
    });
  }

  editarUsuario(): void {
    const dialogRef = this.dialog.open(LoginDialog, {
      width: '235px',
      data: { usuario: this.usuario }
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
        else {
          this.loginService.obterUsuario(result.usuario).subscribe(z => {
            let dados = null;
            try { dados = z.data(); } catch { }
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
  
  // obtém tudo da nuvem novamente
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
export class LoginDialog implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LoginDialog>,
    @Inject(MAT_DIALOG_DATA) public data: LoginData) { }

  public loginForm: FormGroup;

  ngOnInit() {
    this.loginForm = new FormGroup({
      usuario: new FormControl('', [Validators.required]),
      senha: new FormControl('', [Validators.required])
    });
  }

  public hasError = (controlName: string, errorName: string) => {
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

@Component({
  selector: 'dialog-calculator',
  templateUrl: 'shared/dialog-calculator.html',
  styleUrls: ['shared/dialog.css']
})
export class CalculatorDialog implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CalculatorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: LoginData
  ) { }

  currentValue: string = '';
  clear: boolean = false;
  timeOut = null;

  ngOnInit() { }

  appendToValue(number: string, checa: boolean = true): void {
    if (checa) this.checaSeLimpa();
    else this.clear = false;
    this.currentValue += number;
  }

  calcular(): void {
    try {
      if (this.currentValue == '') return;
      this.currentValue = this.currentValue.replace(/,/g, '.');
      const result = eval(this.currentValue);
      this.currentValue = result.toString();
      this.copiar(this.currentValue);
      this.clear = true;
    } catch (error) {
      this.currentValue = 'Erro na expressão';
      this.timeOut = setTimeout(() => {
        this.limpar();
      }, 2500);
    }
  }

  checaSeLimpa(): void {
    if (this.clear) {
      this.currentValue = '';
      this.clear = false;
    }
  }

  limpar(): void {
    this.currentValue = '';
    clearTimeout(this.timeOut);
  }

  copiar(texto: string): void {
    navigator.clipboard.writeText(texto);
  }

  fechar(): void {
    this.dialogRef.close();
  }
}
