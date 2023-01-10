import { Injectable } from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private db: AngularFirestore) { }

  usuario: string;

  login(): boolean {
    let usuario = sessionStorage['usuarioLogado'];
    if (usuario && JSON.parse(usuario) !== null && JSON.parse(usuario) !== "") {
      this.usuario = JSON.parse(usuario);
      return true;
    }
    return false;
  }

  cadastrar(obj: any, ret: any): any {
    obj.senha = Md5.hashStr(obj.senha);
    if (ret == undefined || ret == null) {
      // cadastrar usuario
      alert("A criação de novos usuários está desativada, contate o administrador!");
      return -1;
      // this.salvarUsuario(obj.usuario, { "pass": obj.senha });
      // this.usuario = obj.usuario;
      // sessionStorage['usuarioLogado'] = JSON.stringify(this.usuario);
      // return true;
    } else {
      let pass = (Object as any).values(ret);
      if (obj.senha == pass[0]) {
        // login feito com sucesso
        this.usuario = obj.usuario;
        sessionStorage['usuarioLogado'] = JSON.stringify(this.usuario);
        return true;
      } else {
        // senha incorreta
        this.usuario = 'Convidado';
        return 0;
      }
    }
  }

  obterUsuario(user: string): Observable<any> {
    return this.db.collection("usuarios").doc(user).get();
  }

  salvarUsuario(user: string, pass: any) {
    this.db.collection("usuarios").doc(user).set(Object.assign({}, pass));
  }

}
