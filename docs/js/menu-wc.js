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
                                            'data-target="#controllers-links-module-AppModule-cadf434ce375b84e6582924b3788b7fe"' : 'data-target="#xs-controllers-links-module-AppModule-cadf434ce375b84e6582924b3788b7fe"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-cadf434ce375b84e6582924b3788b7fe"' :
                                            'id="xs-controllers-links-module-AppModule-cadf434ce375b84e6582924b3788b7fe"' }>
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
                                            'data-target="#controllers-links-module-AuthModule-687423e7dfda2be96a8f0379505b4784"' : 'data-target="#xs-controllers-links-module-AuthModule-687423e7dfda2be96a8f0379505b4784"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-687423e7dfda2be96a8f0379505b4784"' :
                                            'id="xs-controllers-links-module-AuthModule-687423e7dfda2be96a8f0379505b4784"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-687423e7dfda2be96a8f0379505b4784"' : 'data-target="#xs-injectables-links-module-AuthModule-687423e7dfda2be96a8f0379505b4784"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-687423e7dfda2be96a8f0379505b4784"' :
                                        'id="xs-injectables-links-module-AuthModule-687423e7dfda2be96a8f0379505b4784"' }>
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
                                <a href="modules/ConfigModule.html" data-type="entity-link" >ConfigModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ConfigModule-2df399f0c28613e0b49837532ed3276b"' : 'data-target="#xs-injectables-links-module-ConfigModule-2df399f0c28613e0b49837532ed3276b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ConfigModule-2df399f0c28613e0b49837532ed3276b"' :
                                        'id="xs-injectables-links-module-ConfigModule-2df399f0c28613e0b49837532ed3276b"' }>
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
                                            'data-target="#controllers-links-module-FilesModule-bb1bd2a7338b67852612ee0d856ee8d0"' : 'data-target="#xs-controllers-links-module-FilesModule-bb1bd2a7338b67852612ee0d856ee8d0"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-FilesModule-bb1bd2a7338b67852612ee0d856ee8d0"' :
                                            'id="xs-controllers-links-module-FilesModule-bb1bd2a7338b67852612ee0d856ee8d0"' }>
                                            <li class="link">
                                                <a href="controllers/FilesController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FilesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-FilesModule-bb1bd2a7338b67852612ee0d856ee8d0"' : 'data-target="#xs-injectables-links-module-FilesModule-bb1bd2a7338b67852612ee0d856ee8d0"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-FilesModule-bb1bd2a7338b67852612ee0d856ee8d0"' :
                                        'id="xs-injectables-links-module-FilesModule-bb1bd2a7338b67852612ee0d856ee8d0"' }>
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
                                            'data-target="#controllers-links-module-NotificationsModule-65e4f3701f89eec9e0c6145f2cf01a18"' : 'data-target="#xs-controllers-links-module-NotificationsModule-65e4f3701f89eec9e0c6145f2cf01a18"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-NotificationsModule-65e4f3701f89eec9e0c6145f2cf01a18"' :
                                            'id="xs-controllers-links-module-NotificationsModule-65e4f3701f89eec9e0c6145f2cf01a18"' }>
                                            <li class="link">
                                                <a href="controllers/NotificationsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotificationsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-NotificationsModule-65e4f3701f89eec9e0c6145f2cf01a18"' : 'data-target="#xs-injectables-links-module-NotificationsModule-65e4f3701f89eec9e0c6145f2cf01a18"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-NotificationsModule-65e4f3701f89eec9e0c6145f2cf01a18"' :
                                        'id="xs-injectables-links-module-NotificationsModule-65e4f3701f89eec9e0c6145f2cf01a18"' }>
                                        <li class="link">
                                            <a href="injectables/NotificationsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotificationsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SendGridModule.html" data-type="entity-link" >SendGridModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-UsersModule-00344f1a4e06d4a12a9573a1d860685f"' : 'data-target="#xs-controllers-links-module-UsersModule-00344f1a4e06d4a12a9573a1d860685f"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-00344f1a4e06d4a12a9573a1d860685f"' :
                                            'id="xs-controllers-links-module-UsersModule-00344f1a4e06d4a12a9573a1d860685f"' }>
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
                                        'data-target="#injectables-links-module-UsersModule-00344f1a4e06d4a12a9573a1d860685f"' : 'data-target="#xs-injectables-links-module-UsersModule-00344f1a4e06d4a12a9573a1d860685f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-00344f1a4e06d4a12a9573a1d860685f"' :
                                        'id="xs-injectables-links-module-UsersModule-00344f1a4e06d4a12a9573a1d860685f"' }>
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
                                <a href="classes/ConfirmationEmailDto.html" data-type="entity-link" >ConfirmationEmailDto</a>
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
                                <a href="classes/FileEntity.html" data-type="entity-link" >FileEntity</a>
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
                                <a href="classes/NotificationEntity.html" data-type="entity-link" >NotificationEntity</a>
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
                            <li class="link">
                                <a href="classes/UserEntity.html" data-type="entity-link" >UserEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserNotificationTokenEntity.html" data-type="entity-link" >UserNotificationTokenEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserRefreshTokenEntity.html" data-type="entity-link" >UserRefreshTokenEntity</a>
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
                                    <a href="injectables/SendGridService.html" data-type="entity-link" >SendGridService</a>
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
                            <li class="link">
                                <a href="interfaces/SendGridModuleAsyncOptions.html" data-type="entity-link" >SendGridModuleAsyncOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SendGridModuleOptions.html" data-type="entity-link" >SendGridModuleOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SendGridOptionsFactory.html" data-type="entity-link" >SendGridOptionsFactory</a>
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