import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { LoaderService } from 'src/app/Service/loader.service';
@Component({
  selector: 'app-privacypolicy-without-login',
  templateUrl: './privacypolicy-without-login.component.html',
  styleUrls: ['./privacypolicy-without-login.component.scss']
})
export class PrivacypolicyWithoutLoginComponent {
  constructor(private titleService: Title, private metaService: Meta, private loaderService: LoaderService) {
    this.updateSEO();
    this.loaderService.hideLoader();
  }
  updateSEO() {
    this.titleService.setTitle('Privacy Policy - Pockit');
    this.metaService.updateTag({ name: 'description', content: 'Read the Privacy Policy of Pockit Web to understand how we collect, use, and protect your personal information.' });
    this.metaService.updateTag({ name: 'keywords', content: 'privacy policy, Pockit Web privacy, data protection, personal information, user privacy' });
    this.metaService.updateTag({ property: 'og:title', content: 'Privacy Policy - Pockit Web' });
    this.metaService.updateTag({ property: 'og:description', content: 'Review the Privacy Policy of Pockit Web to understand our data collection and protection practices.' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://my.pockitengineers.com/privacy_policy_page' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Privacy Policy - Pockit Web' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Understand how Pockit Web collects and protects your personal data.' });
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
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
        'All orders for products or services are subject to acceptance by Pockit Engineers.',
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
      description: 'Pockit Engineers is not liable for indirect or consequential damages. Total liability is limited to the amount paid for the product or service.'
    },
    {
      title: 'Intellectual Property',
      description: 'All content, trademarks, and data on our website are the property of Pockit Engineers or its licensors.'
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
