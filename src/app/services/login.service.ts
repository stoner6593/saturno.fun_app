import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/interfaces/user.interface';
import { map, catchError } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class LoginService {


	token: string;
	menu: any[] = [];

	public user: User;

	// user observable
	public userSource = new Subject<User>();
	user$ = this.userSource.asObservable();


	constructor(
		private http: HttpClient,
		private router: Router
	) {
		if (localStorage.getItem('token') && localStorage.getItem('user') && localStorage.getItem('menu')) {
			this.token = JSON.parse(localStorage.getItem('token'));
			this.menu = JSON.parse(localStorage.getItem('menu'));
			let user = JSON.parse(localStorage.getItem('user'));
			this.pushUser(user);
		}
	}

	// ========================================================
	// Register Methods
	// ========================================================

	createUser(user: User) {
		let data = { user };
		const url = environment.url + '/u/register';
		return this.http.post(url, data);
	}

	checkEmailExists(pattern: string) {
		let data = { pattern }
		const url = environment.url + '/u/checkemailexists';
		return this.http.post(url, data);
	}

	// ========================================================
	// Login Methods
	// ========================================================

	// google and normal login
	login(gtoken: string, user: User, recordar: boolean = false) {
		recordar ? localStorage.setItem('email', user.tx_email) : localStorage.removeItem('email');

		const api = gtoken ? '/u/google' : '/u/login'
		const data = gtoken ? { gtoken } : user;
		const url = environment.url + api;

		return this.http.post(url, data).pipe(map((resp: any) => {
			localStorage.setItem('token', JSON.stringify(resp.token));
			localStorage.setItem('menu', JSON.stringify(resp.menu));
			localStorage.setItem('user', JSON.stringify(resp.user));
			this.token = resp.token;
			this.menu = resp.menu;
			this.user = resp.user;
			return resp;
		}),
			catchError(err => {
				return throwError(err);
			})
		);
	}

	logged() {
		if (!this.token) {
			return false;
		} 
		const payload = JSON.parse(atob(this.token.split('.')[1]));
		const ahora = new Date().getTime() / 1000;
		if (payload.exp < ahora) {
			this.logout();
			return false; // token expirado
		} else {
			return true; // token valido
		}
	}

	pushUser(user: User) {
		localStorage.setItem('user', JSON.stringify(user));
		this.user = user;
		this.userSource.next(this.user);
	}

	updateToken() {
		const url = environment.url + '/u/updatetoken';
		// url += '?token=' + this.token;

		let data = { user: this.user };
		return this.http.post(url, data)
			.pipe(map((resp: any) => {
				if (resp.ok) {
					this.token = resp.newtoken;
					localStorage.setItem('token', JSON.stringify(this.token));
				} else {
					this.logout();
				}
				return resp;
			}));

	}

	logout() {

		if (localStorage.getItem('user')) { localStorage.removeItem('user'); }
		if (localStorage.getItem('token')) { localStorage.removeItem('token'); }
		if (localStorage.getItem('menu')) { localStorage.removeItem('menu'); }

		if (localStorage.getItem('table')) { localStorage.removeItem('table'); }
		if (localStorage.getItem('tables')) { localStorage.removeItem('tables'); }

		if (localStorage.getItem('section')) { localStorage.removeItem('section'); }
		if (localStorage.getItem('tickets')) { localStorage.removeItem('tickets'); }


		delete this.token;
		delete this.menu;
		delete this.user;

		this.userSource.next(null)
		this.router.navigate(['/home']);
	}

}
