import { Directive, ElementRef, HostListener, Input, Renderer2, ViewContainerRef, ComponentRef } from '@angular/core';
import { TooltipComponent } from '../components/tooltip';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective {
  @Input('appTooltip') tooltipText = '';
  private componentRef: ComponentRef<TooltipComponent> | null = null;

  constructor(
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef
  ) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    if (!this.tooltipText) return;
    
    this.componentRef = this.viewContainerRef.createComponent(TooltipComponent);
    this.componentRef.instance.text = this.tooltipText;
    
    const domElem = (this.componentRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);
    
    this.setPosition(domElem);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.destroy();
  }

  ngOnDestroy() {
    this.destroy();
  }

  private setPosition(tooltip: HTMLElement) {
    const hostPos = this.elementRef.nativeElement.getBoundingClientRect();
    const tooltipPos = tooltip.getBoundingClientRect();
    
    // Position above by default
    const top = hostPos.top - tooltipPos.height - 10;
    const left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
    
    tooltip.style.top = `${top + window.scrollY}px`;
    tooltip.style.left = `${left + window.scrollX}px`;
  }

  private destroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}
