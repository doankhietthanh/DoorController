export function Validator(options) {

    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var selectorRules = {};

    function validate(inputElement, rule) {
        var errorMessage;
        var errorElement = getParent(inputElement, '.form-group').querySelector('.form-message');
        var rules = selectorRules[rule.selector];

        // rule list

        for (var i = 0; i < rules.length; ++i) {
            errorMessage = rules[i](inputElement.value);
            if (errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
        }
        else {
            errorElement.innerText = '';
        }
        return !errorMessage;
    }

    var formElement = document.querySelector(options.form);

    if (formElement) {

        //submit form

        formElement.onsubmit = function (e) {
            e.preventDefault();

            var isFormvalid = true;

            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormvalid = false;
                }
            });
            if (isFormvalid) {
                if (typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]');
                    var formValues = Array.from(enableInputs).reduce(function (values, input) {
                        values[input.name] = input.value;
                        return values;
                    }, {});
                    options.onSubmit(formValues);
                }
            }
        }

        // lặp kiểm tra rule
        options.rules.forEach(function (rule) {
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }
            var inputElement = formElement.querySelector(rule.selector);
            if (inputElement) {
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                }
            }
        });

    }

}
// rule yêu cầu nhập
Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : message || 'Vui lòng nhập Họ và tên'
        }
    }
}
// rule nhập tên
Validator.isName = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /(^[A-Za-z]{3,16})([ ]{0,1})([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})/
            return regex.test(value) ? undefined : message || 'Tên của bạn không hợp lệ'
        }
    }
}
// rule nhập mail
Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Email không hợp lệ'
        }
    }
}
// rule password
Validator.isPassword = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
            return regex.test(value) ? undefined : message || 'Mật khẩu phải có ít nhất 8 ký tự (bao gồm 1 chữ cái viết hoa, 1 số và 1 ký tự đặc biệt)'
        }
    }
}
// rule xác nhận
Validator.confirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập không hợp lệ';
        }
    }
}

Validator.isDate = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;
            return regex.test(value) ? undefined : message || 'Ngày sinh không hợp lệ!'
        }
    }
}

Validator.isPhoneNumber = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
            return regex.test(value) ? undefined : message || 'Số điện thoại không hợp lệ!'
        }
    }
}



