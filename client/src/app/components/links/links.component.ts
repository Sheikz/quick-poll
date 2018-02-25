import { Component, Input } from '@angular/core';
import * as copyToClipboard from 'copy-text-to-clipboard';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
    selector: 'app-poll-links',
    templateUrl: './links.html',
    styleUrls: [ './links.scss' ]
})
export class LinksComponent {

    copied: string;

    @Input()
    links;

    copy(text) {
        copyToClipboard(text);
        this.copied = text;
    }

    getRouterLink(type: string) {
        console.log('links', this.links);
        return `/${type}/${this.getToken(this.links[type])}`;
    }

    getToken(input) {
        return /.*\/(.*$)/.exec(input)[1];
    }

}
