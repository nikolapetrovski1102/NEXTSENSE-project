export class Cookie {

    constructor() {}

    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
        return null;
    }

    setCookie(name, value, valid_to) {
        var expires = "";
        if (valid_to) {
            const expirationDate = new Date(valid_to).toUTCString();
            expires = "; expires=" + expirationDate;
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax; Secure";
    }

    deleteCookie(name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax; Secure";
    }

}