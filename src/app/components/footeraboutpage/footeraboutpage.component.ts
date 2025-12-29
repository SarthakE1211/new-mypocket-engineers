import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-footeraboutpage',
  templateUrl: './footeraboutpage.component.html',
  styleUrls: ['./footeraboutpage.component.scss']
})
export class FooteraboutpageComponent {
  openedIndex: number = 0;

  accordionItems = [
    {
      id: 'collapseOne',
      title: 'Centralized Management:',
      content: 'Simplify IT operations with our centralized management platform, making it easy to oversee users, applications, and devices all in one place. Spend less time on administration and more time on what matters—your business.'
    },
    {
      id: 'collapseTwo',
      title: 'Cost Efficiency',
      content: 'Achieve significant savings with solutions that reduce IT expenses by up to 50%. Our services are tailored to fit your unique business needs, ensuring maximum value without compromising quality.'
    },
    {
      id: 'collapseThree',
      title: 'Enhanced Cybersecurity',
      content: 'Safeguard your data and operations with cutting-edge security measures. Our comprehensive approach protects your business from cyber threats, giving you the confidence to operate securely.'
    },
    {
      id: 'collapseFour',
      title: 'Scalable Growth',
      content: 'Focus on expanding your business while we manage your IT requirements seamlessly. Our solutions are designed to scale as you grow, providing reliable support every step of the way.'
    }
  ];
  // openedIndex: number = 0;

  toggle(index: number): void {
    this.openedIndex = this.openedIndex === index ? -1 : index;
    
  }
  

  istrue = false
 


  clientLogos = [
    { imageUrl: 'assets/img/partnerslogo/client-logo-1.png' },
    { imageUrl: 'assets/img/partnerslogo/client-logo-2.png' },
    { imageUrl: 'assets/img/partnerslogo/client-logo-3.png' },
    { imageUrl: 'assets/img/partnerslogo/client-logo-4.png' },
    { imageUrl: 'assets/img/partnerslogo/client-logo-5.png' },
    { imageUrl: 'assets/img/partnerslogo/client-logo-1.png' },
    { imageUrl: 'assets/img/partnerslogo/client-logo-2.png' },
    { imageUrl: 'assets/img/partnerslogo/client-logo-3.png' },
    { imageUrl: 'assets/img/partnerslogo/client-logo-4.png' },
    { imageUrl: 'assets/img/partnerslogo/client-logo-5.png' },
    { imageUrl: 'assets/img/partnerslogo/client-logo-1.png' },
    { imageUrl: 'assets/img/partnerslogo/client-logo-2.png' },
    { imageUrl: 'assets/img/partnerslogo/client-logo-3.png' },
    { imageUrl: 'assets/img/partnerslogo/client-logo-4.png' },
    { imageUrl: 'assets/img/partnerslogo/client-logo-5.png' },
    { imageUrl: 'assets/img/partnerslogo/client-logo-1.png' },
    { imageUrl: 'assets/img/partnerslogo/client-logo-2.png' },
    { imageUrl: 'assets/img/partnerslogo/client-logo-3.png' },
    { imageUrl: 'assets/img/partnerslogo/client-logo-4.png' },
    { imageUrl: 'assets/img/partnerslogo/client-logo-5.png' }
  ];
  
  
  logoCarouselOptions = {
    loop: true,
    margin: 10,
    nav: false,
    dots: false,
    autoplay: false,
    autoplayTimeout: 2000,
    responsive: {
      0: {
        items: 2
      },
      600: {
        items: 4
      },
      1000: {
        items: 5
      }
    }
  };

  @ViewChildren('countEl') countEls!: QueryList<ElementRef>;

ngAfterViewInit(): void {
  this.countEls.forEach((el) => {
    const target = +el.nativeElement.getAttribute('data-count');
    let count = 0;
    const speed = 100;

    const updateCount = () => {
      const increment = Math.ceil(target / speed);
      if (count < target) {
        count += increment;
        if (count > target) count = target;
        el.nativeElement.innerText = count;
        setTimeout(updateCount, 50);
      } else {
        el.nativeElement.innerText = target;
      }
    };

    updateCount();
  });
}

}