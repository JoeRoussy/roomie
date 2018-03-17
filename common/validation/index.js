export const isEmpty = (value) => !value

export const isText = (value) => {
    // We accept strings and numbers as text
    if (!(typeof value === 'string' || typeof value === 'number')) {
        return false;
    }

    return !!value;
}

export const isEmail = (value) => {
    if (!isText(value)) {
        return false;
    }

    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return regex.test(value);
}

export const isPassword = (value, checkLength = true) => {
    if (!isText(value)) {
        return false;
    }

    if (!checkLength) {
        // We have text and we don't need to check the length so return true
        return true;
    }

    const {
        MIN_PASSWORD_LENGTH
    } = process.env;

    // Coerce password length into a number before making the comparisson
    return value.length >= +MIN_PASSWORD_LENGTH;
}

export const isPrice = (value) => {
    return /^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/.test(value);
}

export const isInteger = (value) => {
    return value && !isNaN(Number(value)) && Number.isInteger(value*1);
}

export const isFullOrHalfInt = (value) => {
    return value && !isNaN(Number(value)) && Number.isInteger(value*2);
}

export const isPostalCode = (value) => {
    return /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(value);
}
