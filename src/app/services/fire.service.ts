import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class FireService {

  constructor(private db: AngularFirestore, private loginService: LoginService) { }

  private colecoes: string[] =  ["contas", "despesas", "recebimentos", "categorias", "transferencias"];
  private cont: number;

  obterDados(colecao: string): Observable<any> {
    return this.db.collection(colecao).doc(this.loginService.usuario).get();
  }

  salvarDados(colecao: string, lista: any) {
    this.db.collection(colecao).doc(this.loginService.usuario).set(Object.assign({}, lista));
  }

  obterTudo() {
    this.cont = 0;
    this.colecoes.forEach(colecao => {
      this.obterDados(colecao).subscribe(z => {
        localStorage.removeItem(colecao);
        try {
          let dados = (Object as any).values(z.data());
          localStorage[colecao] = JSON.stringify(dados);
        } catch {}
        finally {
          if (++this.cont == this.colecoes.length) {
            window.location.reload();
          }
        }
      });
    });
  }

  salvarColecao(ind: number) {
    const colecao = this.colecoes[ind];
    const lista = localStorage[colecao];
    if (lista) {
      this.salvarDados(colecao, JSON.parse(lista));
    }
  }

}
