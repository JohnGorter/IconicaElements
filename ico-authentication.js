import '/node_modules/@polymer/polymer/polymer.js'
import { Element } from  '/node_modules/@polymer/polymer/polymer-element.js'

export class IcoAuthentication extends Element {
    static get properties() {
        return {
            anonymous: { type:Boolean, value:false, observer:'_authChanged'},
            google: { type:Boolean, value:false, observer:'_authChanged'},
            user: { type:Object, value:undefined, notify:true}
        }
    }
    _authChanged(){
        if (this.anonymous || this.google)  this._login();
    }

    _login(){
        if (this.anonymous) this.signInAnonymously(); 
        if (this.google) this.signInWithGooglePopup();
    }

    signUp(email, password){ return firebase.auth().createUserWithEmailAndPassword(email, password); }

    signInWithEmail(email, password){
        return firebase.auth().signInWithEmailAndPassword(email, password).then((user)=>{  this.user = user; });
    }

    signInWithGooglePopup(){
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        this.token = result.credential.accessToken;
        // The signed-in user info.
        this.user = result.user;
        }).catch(function(error) {
            console.log("error", error);
        });
    }

    signout() {
        firebase.auth().signOut().then(() => {
            this.user = {};
        });
    } 
    signInAnonymously(){
        firebase.auth().signInAnonymously().then((user) => {
            this.user = user;
        }).catch(function(error) {
           console.log("error", error);
          });
    }

    signInWithPhoneNumber(telnumber, cb) {
        firebase.auth().languageCode = 'nl';
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
            'size': 'normal',
            'callback': (response) => {
                cb();
                firebase.auth().signInWithPhoneNumber(telnumber, window.recaptchaVerifier)
                    .then(function (confirmationResult) {
                        window.confirmationResult = confirmationResult;
                    }).catch(function (error) {
                        console.log('error', error);
                    });
            }
        });
        recaptchaVerifier.render().then(function(widgetId) {
            window.recaptchaWidgetId = widgetId;
        });
    }

    completeSignInWithPhoneNumber(code, cb){
        window.confirmationResult.confirm(code).then((result) => {
            this.user = result.user;
            cb();
        }).catch(function (error) {
            console.log('error', error);
        });
    }
}

customElements.define('ico-auth', IcoAuthentication);