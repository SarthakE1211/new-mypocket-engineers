import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-privacypolicy-without-login',
  templateUrl: './privacypolicy-without-login.component.html',
  styleUrls: ['./privacypolicy-without-login.component.scss']
})
export class PrivacypolicyWithoutLoginComponent {
 constructor(private titleService: Title,private metaService: Meta) { this.updateSEO() }

  updateSEO() {
    // Set Page Title
    this.titleService.setTitle('Terms and Conditions - PockIT');

    // Meta Description & Keywords
    this.metaService.updateTag({ name: 'description', content: 'Read the Terms and Conditions of PockIT Web to understand our policies on IT services, hardware sales, payments, returns, and user responsibilities.' });
    this.metaService.updateTag({ name: 'keywords', content: 'terms and conditions, PockIT Web policies, IT services terms, hardware sales policy, return policy, warranty, user agreement' });

    // Open Graph (For Facebook, LinkedIn)
    this.metaService.updateTag({ property: 'og:title', content: 'Terms and Conditions - PockIT Web' });
    this.metaService.updateTag({ property: 'og:description', content: 'Review the Terms and Conditions of PockIT Web, covering IT services, hardware sales, payments, shipping, refunds, and warranties.' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://my.pockitengineers.com/terms-and-conditions' });

    // Twitter Card
    this.metaService.updateTag({ name: 'twitter:title', content: 'Terms and Conditions - PockIT Web' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Understand the policies of PockIT Web regarding IT services, hardware sales, payment terms, shipping, and returns.' });
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });

    // Canonical Tag
    let link: HTMLLinkElement = document.querySelector("link[rel='canonical']") || document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', window.location.href);
    document.head.appendChild(link);
    
}

  termsSections = [
    {
      title: 'Services Offered',
      points: [
        'IT hardware repair and maintenance.',
        'Network setup and support.',
        'Software installation and troubleshooting.',
        'IT consulting services.',
        'Sale of IT hardware products including computers, peripherals, and accessories.'
      ]
    },
    {
      title: 'User Responsibilities',
      points: [
        'Provide accurate and complete information when creating an account or placing an order.',
        'Maintain the confidentiality of your account credentials.',
        'Notify us immediately of any unauthorized use of your account.',
        'Use our Services only for lawful purposes and in accordance with these Terms.'
      ]
    },
    {
      title: 'Orders and Payments',
      points: [
        'All orders for products or services are subject to acceptance by PockIT Engineers.',
        'Prices for products and services may change without prior notice.',
        'Payment is due at the time of order placement unless otherwise agreed upon.'
      ]
    },
    {
      title: 'Shipping and Delivery',
      points: [
        'We offer shipping in specified regions.',
        'Delivery dates are estimates and not guaranteed.',
        'We are not responsible for delays beyond our control.'
      ]
    },
    {
      title: 'Returns and Refunds',
      points: [],
      description: 'Returns are accepted within 7 days for hardware products if they are in original condition. Refunds for services will be evaluated case-by-case.'
    },
    {
      title: 'Warranty',
      points: [
        '180-day warranty on repairs. Issues recurring within this period will be addressed at no cost.',
        'Product warranties are as per manufacturer policies.'
      ]
    },
    {
      title: 'Limitation of Liability',
      description: 'PockIT Engineers is not liable for indirect or consequential damages. Total liability is limited to the amount paid for the product or service.'
    },
    {
      title: 'Intellectual Property',
      description: 'All content, trademarks, and data on our website are the property of PockIT Engineers or its licensors.'
    },
    {
      title: 'Privacy Policy',
      description: 'Your privacy is important. Please refer to our Privacy Policy for more details.'
    },
    {
      title: 'Governing Law',
      description: 'These Terms are governed by Indian law and disputes are subject to the jurisdiction of Pune courts.'
    }
  ];
}
