import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent {
  constructor(private titleService: Title,private metaService: Meta) { this.updateSEO() }
  updateSEO() {
    // Set Page Title
    this.titleService.setTitle('Privacy Policy - PockIT');

    // Meta Description & Keywords
    this.metaService.updateTag({ name: 'description', content: 'Read PockIT Web\'s Privacy Policy to learn how we collect, use, and protect your personal data when using our IT services and purchasing computer hardware.' });
    this.metaService.updateTag({ name: 'keywords', content: 'privacy policy, data protection, personal information, IT services privacy, hardware sales privacy, online security, cookies policy' });

    // Open Graph (For Facebook, LinkedIn)
    this.metaService.updateTag({ property: 'og:title', content: 'Privacy Policy - PockIT Web' });
    this.metaService.updateTag({ property: 'og:description', content: 'Find out how PockIT Web ensures your privacy and data security while using our IT services and purchasing computer hardware.' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://my.pockitengineers.com/privacy-policy' });

    // Twitter Card
    this.metaService.updateTag({ name: 'twitter:title', content: 'Privacy Policy - PockIT Web' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Learn about PockIT Web\'s data collection practices and privacy measures while using our IT services and purchasing hardware.' });
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });

    // Canonical Tag
    let link: HTMLLinkElement = document.querySelector("link[rel='canonical']") || document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', window.location.href);
    document.head.appendChild(link);
    
}
}
