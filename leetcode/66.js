var plusOne = function(digits) {

    let i = digits.length - 1;

    while (i >= 0) {

        if (digits[i] < 9) {
            digits[i]++;
            console.log(digits)
            return digits;
        }

        digits[i] = 0;
        i--;
    }

    digits.unshift(1);
    return digits;
};
digits = [1,2,3]
plusOne(digits)