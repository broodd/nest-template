'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">nest-template documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="changelog.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CHANGELOG
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-92c744fdbafeb647d171846a3a2613c1730f7d91d388112baf193aa04816a7fed87e68a8139e483ded4db2339a61fa9de1023d03b8a78a21bb82823844d0e85d"' : 'data-target="#xs-controllers-links-module-AppModule-92c744fdbafeb647d171846a3a2613c1730f7d91d388112baf193aa04816a7fed87e68a8139e483ded4db2339a61fa9de1023d03b8a78a21bb82823844d0e85d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-92c744fdbafeb647d171846a3a2613c1730f7d91d388112baf193aa04816a7fed87e68a8139e483ded4db2339a61fa9de1023d03b8a78a21bb82823844d0e85d"' :
                                            'id="xs-controllers-links-module-AppModule-92c744fdbafeb647d171846a3a2613c1730f7d91d388112baf193aa04816a7fed87e68a8139e483ded4db2339a61fa9de1023d03b8a78a21bb82823844d0e85d"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AuthModule-28426da6dbb85f433ffb5b1c66177c54bf5c012431fbfdb616c2c7da9bce008ff817dfce0358849afed46d5b0f5e7ce97a02474accf9fd8571f7d78bc8021053"' : 'data-target="#xs-controllers-links-module-AuthModule-28426da6dbb85f433ffb5b1c66177c54bf5c012431fbfdb616c2c7da9bce008ff817dfce0358849afed46d5b0f5e7ce97a02474accf9fd8571f7d78bc8021053"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-28426da6dbb85f433ffb5b1c66177c54bf5c012431fbfdb616c2c7da9bce008ff817dfce0358849afed46d5b0f5e7ce97a02474accf9fd8571f7d78bc8021053"' :
                                            'id="xs-controllers-links-module-AuthModule-28426da6dbb85f433ffb5b1c66177c54bf5c012431fbfdb616c2c7da9bce008ff817dfce0358849afed46d5b0f5e7ce97a02474accf9fd8571f7d78bc8021053"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-28426da6dbb85f433ffb5b1c66177c54bf5c012431fbfdb616c2c7da9bce008ff817dfce0358849afed46d5b0f5e7ce97a02474accf9fd8571f7d78bc8021053"' : 'data-target="#xs-injectables-links-module-AuthModule-28426da6dbb85f433ffb5b1c66177c54bf5c012431fbfdb616c2c7da9bce008ff817dfce0358849afed46d5b0f5e7ce97a02474accf9fd8571f7d78bc8021053"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-28426da6dbb85f433ffb5b1c66177c54bf5c012431fbfdb616c2c7da9bce008ff817dfce0358849afed46d5b0f5e7ce97a02474accf9fd8571f7d78bc8021053"' :
                                        'id="xs-injectables-links-module-AuthModule-28426da6dbb85f433ffb5b1c66177c54bf5c012431fbfdb616c2c7da9bce008ff817dfce0358849afed46d5b0f5e7ce97a02474accf9fd8571f7d78bc8021053"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtRefreshTokenStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtRefreshTokenStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ChatsModule.html" data-type="entity-link" >ChatsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ChatsModule-03ade5388fb29feacc07123140c1e27d7813ce72df8587aa55de4258f72d910921da08763a9b616363f3e771f2cd4ec513d2e612aa533e021b96cecd59102e66"' : 'data-target="#xs-controllers-links-module-ChatsModule-03ade5388fb29feacc07123140c1e27d7813ce72df8587aa55de4258f72d910921da08763a9b616363f3e771f2cd4ec513d2e612aa533e021b96cecd59102e66"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ChatsModule-03ade5388fb29feacc07123140c1e27d7813ce72df8587aa55de4258f72d910921da08763a9b616363f3e771f2cd4ec513d2e612aa533e021b96cecd59102e66"' :
                                            'id="xs-controllers-links-module-ChatsModule-03ade5388fb29feacc07123140c1e27d7813ce72df8587aa55de4258f72d910921da08763a9b616363f3e771f2cd4ec513d2e612aa533e021b96cecd59102e66"' }>
                                            <li class="link">
                                                <a href="controllers/ChatsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChatsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ChatsModule-03ade5388fb29feacc07123140c1e27d7813ce72df8587aa55de4258f72d910921da08763a9b616363f3e771f2cd4ec513d2e612aa533e021b96cecd59102e66"' : 'data-target="#xs-injectables-links-module-ChatsModule-03ade5388fb29feacc07123140c1e27d7813ce72df8587aa55de4258f72d910921da08763a9b616363f3e771f2cd4ec513d2e612aa533e021b96cecd59102e66"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ChatsModule-03ade5388fb29feacc07123140c1e27d7813ce72df8587aa55de4258f72d910921da08763a9b616363f3e771f2cd4ec513d2e612aa533e021b96cecd59102e66"' :
                                        'id="xs-injectables-links-module-ChatsModule-03ade5388fb29feacc07123140c1e27d7813ce72df8587aa55de4258f72d910921da08763a9b616363f3e771f2cd4ec513d2e612aa533e021b96cecd59102e66"' }>
                                        <li class="link">
                                            <a href="injectables/ChatMessagesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChatMessagesService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ChatParticipantsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChatParticipantsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ChatsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChatsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ConfigModule.html" data-type="entity-link" >ConfigModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ConfigModule-01797ee1239f9a492c29a5fb48e4324dc9b1a35c96267c1d8af8df7abf4b7a6f1a00f3a292405328296edb76d466eb2bb548aaf86a6f9b300ad5e80e4638a1c4"' : 'data-target="#xs-injectables-links-module-ConfigModule-01797ee1239f9a492c29a5fb48e4324dc9b1a35c96267c1d8af8df7abf4b7a6f1a00f3a292405328296edb76d466eb2bb548aaf86a6f9b300ad5e80e4638a1c4"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ConfigModule-01797ee1239f9a492c29a5fb48e4324dc9b1a35c96267c1d8af8df7abf4b7a6f1a00f3a292405328296edb76d466eb2bb548aaf86a6f9b300ad5e80e4638a1c4"' :
                                        'id="xs-injectables-links-module-ConfigModule-01797ee1239f9a492c29a5fb48e4324dc9b1a35c96267c1d8af8df7abf4b7a6f1a00f3a292405328296edb76d466eb2bb548aaf86a6f9b300ad5e80e4638a1c4"' }>
                                        <li class="link">
                                            <a href="injectables/ConfigService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfigService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DatabaseModule.html" data-type="entity-link" >DatabaseModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/FilesModule.html" data-type="entity-link" >FilesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-FilesModule-2249e750ab9dc99a700b2600bdcc8b8fa223e3bd3aa07c96e4532d39b9f820fd0f7c6321f7c4b0cd90e178af015c9ec24299e38608be45eb67c820db848eb87b"' : 'data-target="#xs-controllers-links-module-FilesModule-2249e750ab9dc99a700b2600bdcc8b8fa223e3bd3aa07c96e4532d39b9f820fd0f7c6321f7c4b0cd90e178af015c9ec24299e38608be45eb67c820db848eb87b"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-FilesModule-2249e750ab9dc99a700b2600bdcc8b8fa223e3bd3aa07c96e4532d39b9f820fd0f7c6321f7c4b0cd90e178af015c9ec24299e38608be45eb67c820db848eb87b"' :
                                            'id="xs-controllers-links-module-FilesModule-2249e750ab9dc99a700b2600bdcc8b8fa223e3bd3aa07c96e4532d39b9f820fd0f7c6321f7c4b0cd90e178af015c9ec24299e38608be45eb67c820db848eb87b"' }>
                                            <li class="link">
                                                <a href="controllers/FilesController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FilesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-FilesModule-2249e750ab9dc99a700b2600bdcc8b8fa223e3bd3aa07c96e4532d39b9f820fd0f7c6321f7c4b0cd90e178af015c9ec24299e38608be45eb67c820db848eb87b"' : 'data-target="#xs-injectables-links-module-FilesModule-2249e750ab9dc99a700b2600bdcc8b8fa223e3bd3aa07c96e4532d39b9f820fd0f7c6321f7c4b0cd90e178af015c9ec24299e38608be45eb67c820db848eb87b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-FilesModule-2249e750ab9dc99a700b2600bdcc8b8fa223e3bd3aa07c96e4532d39b9f820fd0f7c6321f7c4b0cd90e178af015c9ec24299e38608be45eb67c820db848eb87b"' :
                                        'id="xs-injectables-links-module-FilesModule-2249e750ab9dc99a700b2600bdcc8b8fa223e3bd3aa07c96e4532d39b9f820fd0f7c6321f7c4b0cd90e178af015c9ec24299e38608be45eb67c820db848eb87b"' }>
                                        <li class="link">
                                            <a href="injectables/FilesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FilesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MultipartModule.html" data-type="entity-link" >MultipartModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/NotificationsModule.html" data-type="entity-link" >NotificationsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-NotificationsModule-20aabdd3e8682bac3051fbfdc5185b2904946f624d2869bd2c265d59834b533ba4e2d9bcfa7efb562f833aaf18a020a7d5a9fc334261b75df782617465fa136e"' : 'data-target="#xs-controllers-links-module-NotificationsModule-20aabdd3e8682bac3051fbfdc5185b2904946f624d2869bd2c265d59834b533ba4e2d9bcfa7efb562f833aaf18a020a7d5a9fc334261b75df782617465fa136e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-NotificationsModule-20aabdd3e8682bac3051fbfdc5185b2904946f624d2869bd2c265d59834b533ba4e2d9bcfa7efb562f833aaf18a020a7d5a9fc334261b75df782617465fa136e"' :
                                            'id="xs-controllers-links-module-NotificationsModule-20aabdd3e8682bac3051fbfdc5185b2904946f624d2869bd2c265d59834b533ba4e2d9bcfa7efb562f833aaf18a020a7d5a9fc334261b75df782617465fa136e"' }>
                                            <li class="link">
                                                <a href="controllers/NotificationsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotificationsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-NotificationsModule-20aabdd3e8682bac3051fbfdc5185b2904946f624d2869bd2c265d59834b533ba4e2d9bcfa7efb562f833aaf18a020a7d5a9fc334261b75df782617465fa136e"' : 'data-target="#xs-injectables-links-module-NotificationsModule-20aabdd3e8682bac3051fbfdc5185b2904946f624d2869bd2c265d59834b533ba4e2d9bcfa7efb562f833aaf18a020a7d5a9fc334261b75df782617465fa136e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-NotificationsModule-20aabdd3e8682bac3051fbfdc5185b2904946f624d2869bd2c265d59834b533ba4e2d9bcfa7efb562f833aaf18a020a7d5a9fc334261b75df782617465fa136e"' :
                                        'id="xs-injectables-links-module-NotificationsModule-20aabdd3e8682bac3051fbfdc5185b2904946f624d2869bd2c265d59834b533ba4e2d9bcfa7efb562f833aaf18a020a7d5a9fc334261b75df782617465fa136e"' }>
                                        <li class="link">
                                            <a href="injectables/NotificationsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotificationsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SendMailModule.html" data-type="entity-link" >SendMailModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SendMailModule-cbe2f8f820c84c0e185938ec52ea5fe9a115c78c7a1fd3281eafb569ac47d2d9bf92e7e875d1e3945afbbd6ef90f2171d0fe782d52a42ec5179dcfcc819afac1"' : 'data-target="#xs-injectables-links-module-SendMailModule-cbe2f8f820c84c0e185938ec52ea5fe9a115c78c7a1fd3281eafb569ac47d2d9bf92e7e875d1e3945afbbd6ef90f2171d0fe782d52a42ec5179dcfcc819afac1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SendMailModule-cbe2f8f820c84c0e185938ec52ea5fe9a115c78c7a1fd3281eafb569ac47d2d9bf92e7e875d1e3945afbbd6ef90f2171d0fe782d52a42ec5179dcfcc819afac1"' :
                                        'id="xs-injectables-links-module-SendMailModule-cbe2f8f820c84c0e185938ec52ea5fe9a115c78c7a1fd3281eafb569ac47d2d9bf92e7e875d1e3945afbbd6ef90f2171d0fe782d52a42ec5179dcfcc819afac1"' }>
                                        <li class="link">
                                            <a href="injectables/SendMailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SendMailService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SocketsModule.html" data-type="entity-link" >SocketsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SocketsModule-96ce3b1710b1ef231b2c9ed4146797946fcbf1559a422dea8c57d4245367259b3bd4c52b55854a2b418cc8367d8bb5b232f309943225c4ef10b6b5e5605aa595"' : 'data-target="#xs-injectables-links-module-SocketsModule-96ce3b1710b1ef231b2c9ed4146797946fcbf1559a422dea8c57d4245367259b3bd4c52b55854a2b418cc8367d8bb5b232f309943225c4ef10b6b5e5605aa595"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SocketsModule-96ce3b1710b1ef231b2c9ed4146797946fcbf1559a422dea8c57d4245367259b3bd4c52b55854a2b418cc8367d8bb5b232f309943225c4ef10b6b5e5605aa595"' :
                                        'id="xs-injectables-links-module-SocketsModule-96ce3b1710b1ef231b2c9ed4146797946fcbf1559a422dea8c57d4245367259b3bd4c52b55854a2b418cc8367d8bb5b232f309943225c4ef10b6b5e5605aa595"' }>
                                        <li class="link">
                                            <a href="injectables/SocketsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SocketsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-UsersModule-7c0a8d1e04c990e89a21347f5b83ac56f838556c30b1cf0eb17f9ee2bc1365eb82f29a32f23c1c371c602ba26b083b7e2dd7462a4c5562d7ccc3756812847abb"' : 'data-target="#xs-controllers-links-module-UsersModule-7c0a8d1e04c990e89a21347f5b83ac56f838556c30b1cf0eb17f9ee2bc1365eb82f29a32f23c1c371c602ba26b083b7e2dd7462a4c5562d7ccc3756812847abb"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-7c0a8d1e04c990e89a21347f5b83ac56f838556c30b1cf0eb17f9ee2bc1365eb82f29a32f23c1c371c602ba26b083b7e2dd7462a4c5562d7ccc3756812847abb"' :
                                            'id="xs-controllers-links-module-UsersModule-7c0a8d1e04c990e89a21347f5b83ac56f838556c30b1cf0eb17f9ee2bc1365eb82f29a32f23c1c371c602ba26b083b7e2dd7462a4c5562d7ccc3756812847abb"' }>
                                            <li class="link">
                                                <a href="controllers/UserNotificationTokensController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserNotificationTokensController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/UsersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UsersModule-7c0a8d1e04c990e89a21347f5b83ac56f838556c30b1cf0eb17f9ee2bc1365eb82f29a32f23c1c371c602ba26b083b7e2dd7462a4c5562d7ccc3756812847abb"' : 'data-target="#xs-injectables-links-module-UsersModule-7c0a8d1e04c990e89a21347f5b83ac56f838556c30b1cf0eb17f9ee2bc1365eb82f29a32f23c1c371c602ba26b083b7e2dd7462a4c5562d7ccc3756812847abb"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-7c0a8d1e04c990e89a21347f5b83ac56f838556c30b1cf0eb17f9ee2bc1365eb82f29a32f23c1c371c602ba26b083b7e2dd7462a4c5562d7ccc3756812847abb"' :
                                        'id="xs-injectables-links-module-UsersModule-7c0a8d1e04c990e89a21347f5b83ac56f838556c30b1cf0eb17f9ee2bc1365eb82f29a32f23c1c371c602ba26b083b7e2dd7462a4c5562d7ccc3756812847abb"' }>
                                        <li class="link">
                                            <a href="injectables/UserNotificationTokensService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserNotificationTokensService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserRefreshTokensService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserRefreshTokensService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#controllers-links"' :
                                'data-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AppController.html" data-type="entity-link" >AppController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AuthController.html" data-type="entity-link" >AuthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ChatsController.html" data-type="entity-link" >ChatsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/FilesController.html" data-type="entity-link" >FilesController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/NotificationsController.html" data-type="entity-link" >NotificationsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UserNotificationTokensController.html" data-type="entity-link" >UserNotificationTokensController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UsersController.html" data-type="entity-link" >UsersController</a>
                                </li>
                            </ul>
                        </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#entities-links"' :
                                'data-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/ChatEntity.html" data-type="entity-link" >ChatEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ChatMessageEntity.html" data-type="entity-link" >ChatMessageEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ChatParticipantEntity.html" data-type="entity-link" >ChatParticipantEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/FileEntity.html" data-type="entity-link" >FileEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/NotificationEntity.html" data-type="entity-link" >NotificationEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/UserEntity.html" data-type="entity-link" >UserEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/UserNotificationTokenEntity.html" data-type="entity-link" >UserNotificationTokenEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/UserRefreshTokenEntity.html" data-type="entity-link" >UserRefreshTokenEntity</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AllExceptionFilter.html" data-type="entity-link" >AllExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChatParticipantEntity.html" data-type="entity-link" >ChatParticipantEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChatReadMessageDto.html" data-type="entity-link" >ChatReadMessageDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChatReadMessageResponseDto.html" data-type="entity-link" >ChatReadMessageResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChatReceiveMessageDto.html" data-type="entity-link" >ChatReceiveMessageDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChatsGateway.html" data-type="entity-link" >ChatsGateway</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConfirmationEmailDto.html" data-type="entity-link" >ConfirmationEmailDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateChatDto.html" data-type="entity-link" >CreateChatDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateChatMessageDto.html" data-type="entity-link" >CreateChatMessageDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateFileDto.html" data-type="entity-link" >CreateFileDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateNotificationDto.html" data-type="entity-link" >CreateNotificationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProfileDto.html" data-type="entity-link" >CreateProfileDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserNotificationTokenDto.html" data-type="entity-link" >CreateUserNotificationTokenDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CredentialsDto.html" data-type="entity-link" >CredentialsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteUserNotificationTokenDto.html" data-type="entity-link" >DeleteUserNotificationTokenDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DownloadFileDto.html" data-type="entity-link" >DownloadFileDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileEntityPreview.html" data-type="entity-link" >FileEntityPreview</a>
                            </li>
                            <li class="link">
                                <a href="classes/FindManyOptionsDto.html" data-type="entity-link" >FindManyOptionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FindOneOptionsDto.html" data-type="entity-link" >FindOneOptionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/HttpExceptionFilter.html" data-type="entity-link" >HttpExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/ID.html" data-type="entity-link" >ID</a>
                            </li>
                            <li class="link">
                                <a href="classes/JwtAccessTokenPayloadDto.html" data-type="entity-link" >JwtAccessTokenPayloadDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/JwtRefreshTokenDto.html" data-type="entity-link" >JwtRefreshTokenDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/JwtRefreshTokenPayloadDto.html" data-type="entity-link" >JwtRefreshTokenPayloadDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/JwtTokensDto.html" data-type="entity-link" >JwtTokensDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginationChatMessagesDto.html" data-type="entity-link" >PaginationChatMessagesDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginationChatParticipantsDto.html" data-type="entity-link" >PaginationChatParticipantsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginationChatsDto.html" data-type="entity-link" >PaginationChatsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginationFilesDto.html" data-type="entity-link" >PaginationFilesDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginationNotificationsDto.html" data-type="entity-link" >PaginationNotificationsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginationUserNotificationTokensDto.html" data-type="entity-link" >PaginationUserNotificationTokensDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginationUsersDto.html" data-type="entity-link" >PaginationUsersDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResetPasswordDto.html" data-type="entity-link" >ResetPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SelectChatMessagesDto.html" data-type="entity-link" >SelectChatMessagesDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SelectChatsDto.html" data-type="entity-link" >SelectChatsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SelectFileDto.html" data-type="entity-link" >SelectFileDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SelectFilesDto.html" data-type="entity-link" >SelectFilesDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SelectNotificationsDto.html" data-type="entity-link" >SelectNotificationsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SelectProfileDto.html" data-type="entity-link" >SelectProfileDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SelectUserDto.html" data-type="entity-link" >SelectUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SelectUserNotificationTokenDto.html" data-type="entity-link" >SelectUserNotificationTokenDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SelectUserNotificationTokensDto.html" data-type="entity-link" >SelectUserNotificationTokensDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SelectUsersDto.html" data-type="entity-link" >SelectUsersDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendResetPasswordDto.html" data-type="entity-link" >SendResetPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SocketsExceptionFilter.html" data-type="entity-link" >SocketsExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/SocketsGateway.html" data-type="entity-link" >SocketsGateway</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateEmailDto.html" data-type="entity-link" >UpdateEmailDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateNotificationDto.html" data-type="entity-link" >UpdateNotificationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePasswordDto.html" data-type="entity-link" >UpdatePasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProfileDto.html" data-type="entity-link" >UpdateProfileDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link" >UpdateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserNotificationTokenDto.html" data-type="entity-link" >UpdateUserNotificationTokenDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UploadedFile.html" data-type="entity-link" >UploadedFile</a>
                            </li>
                            <li class="link">
                                <a href="classes/user1615673396368.html" data-type="entity-link" >user1615673396368</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ChatMessagesService.html" data-type="entity-link" >ChatMessagesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ChatParticipantsService.html" data-type="entity-link" >ChatParticipantsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ChatsService.html" data-type="entity-link" >ChatsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConfigService.html" data-type="entity-link" >ConfigService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FilesService.html" data-type="entity-link" >FilesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FileValidationPipe.html" data-type="entity-link" >FileValidationPipe</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link" >JwtAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtRefreshGuard.html" data-type="entity-link" >JwtRefreshGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtRefreshTokenStrategy.html" data-type="entity-link" >JwtRefreshTokenStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtStrategy.html" data-type="entity-link" >JwtStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificationsService.html" data-type="entity-link" >NotificationsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SendMailService.html" data-type="entity-link" >SendMailService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SocketsService.html" data-type="entity-link" >SocketsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StorageS3Service.html" data-type="entity-link" >StorageS3Service</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StorageService.html" data-type="entity-link" >StorageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TransformInterceptor.html" data-type="entity-link" >TransformInterceptor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserNotificationTokensService.html" data-type="entity-link" >UserNotificationTokensService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserRefreshTokensService.html" data-type="entity-link" >UserRefreshTokensService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersService.html" data-type="entity-link" >UsersService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/CreateMockFileReturn.html" data-type="entity-link" >CreateMockFileReturn</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FindManyBracketsOptions.html" data-type="entity-link" >FindManyBracketsOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MultipartModuleAsyncOptions.html" data-type="entity-link" >MultipartModuleAsyncOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MultipartOptionsFactory.html" data-type="entity-link" >MultipartOptionsFactory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Response.html" data-type="entity-link" >Response</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="unit-test.html"><span class="icon ion-ios-podium"></span>Unit test coverage</a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});