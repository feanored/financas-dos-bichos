import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[contaDesativada]'
})
export class ContaDesativadaDirective implements OnInit {

  constructor(private el: ElementRef) { }

  @Input() contaDesativada: boolean;

  ngOnInit() {
    if (this.contaDesativada) {
      this.el.nativeElement.style.textDecoration = "line-through";
    }
  }

}
