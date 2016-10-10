var request = require('request');


var sfClient = module.exports = function(url, token) {
    this.apiUrl = url + '/api2/';
    this.token = token;

    this.call = function(action, method, body, qs, callback) {
        //no params given, assume last function param as callback function
        if (typeof qs == 'function') {
            callback = qs;
            qs = {};
        } else if (typeof body == 'function') {
            callback = body;
            body = {};
        }

        var options = {
            url: this.apiUrl + action + '/',
            method: method,
            headers: {
                'Authorization': 'Token ' + this.token,
                'Accept': 'application/json'
            }
        }

        if (body) options.form = body;
        if (qs) options.qs = qs;



        request(options, function(err, res, body) {
            if(IsJsonString(body)) body = JSON.parse(body);

            if (err) {
                if ('code' in err && err.code == 'ECONNREFUSED') {
                    return callback(new Error('Cannot connect to Seafile Web API'));
                } else {
                    return callback(err);
                }

            } else if (res.statusCode >= 400) {
                return callback(new Error(res.statusCode + ' Error occured'), body, res.statusCode);

            } else {
                return callback(null, body, res.statusCode);
            }
        });
    }

    //check whether mandatory fields are set; return array of unset params
    this.checkMandatory = function(mand, params){
        var miss = [];

        for(var i = 0; i < mand.length; i++){
            if(!params.hasOwnProperty(mand[i])) miss.push(mand[i]);
        }

        if(miss.length) return new Error('Missing params: ' + miss.join(', '));
        else return false;
    }


    //////////////////////////////////////////////////////////////


    this.listAccounts = function(params, callback) {
        var qs = {};

        if (params.start != null) qs.start = params.start;
        if (params.limit != null) qs.limit = params.limit;
        if (params.scope != null) qs.scope = params.scope;

        this.call('accounts', 'GET', null, qs, function(err, data, code) {
            if (err) return callback(err);
            console.log(code);
            return callback(null, data, code);
        });
    }




    this.createAccount = function(params, callback) {
        var err = this.checkMandatory(['email', 'password'], params);
        if(err) return callback(err);

        var body = {
            password: params.password
        };

        if (params.is_staff != null) body.is_staff = params.is_staff;
        if (params.is_active != null) body.is_active = params.is_active;

        this.call('accounts/' + params.email, 'PUT', body, null, function(err, data, code) {
            if (err) return callback(err);
            return callback(null, data, code);
        });
    }


    this.updateAccount = function(params, callback) {
        var err = this.checkMandatory(['email'], params);
        if(err) return callback(err);

        var body = {};

        if (params.password != null) body.password = params.password;
        if (params.is_staff != null) body.is_staff = params.is_staff;
        if (params.is_active != null) body.is_active = params.is_active;
        if (params.name != null) body.name = params.name;
        if (params.note != null) body.note = params.note;
        if (params.storage != null) body.storage = params.storage;

        if(!Object.keys(body).length) return callback(new Error('Params missing'));


        this.call('accounts/' + params.email, 'PUT', body, null, function(err, data, code) {
            if (err) return callback(err);
            return callback(null, data, code);
        });
    }


    this.deleteAccount = function(email, callback) {
        if(!email) return callback(new Error('Params missing: email'));

        this.call('accounts/' + email, 'DELETE', null, null, function(err, data, code) {
            if (err) return callback(err);
            return callback(null, data, code);
        });
    }


    this.getAccountInfo = function(email, callback){
        if(!email) return callback(new Error('Params missing: email'));

        this.call('accounts/' + email, 'GET', null, null, function(err, data, code) {
            if (err) return callback(err);
            return callback(null, data, code);
        });
    }


    this.addGroupMember = function(params, callback){
        var err = this.checkMandatory(['user_name', 'group_id'], params);
        if(err) return callback(err);

        var body = {};
        if (params.user_name != null) body.user_name = params.user_name;

        this.call('groups/' + params.group_id + '/members/', 'PUT', body, null, function(err, data, code) {
            if (err) return callback(err);
            return callback(null, data, code);
        });
    }


    this.deleteGroupMember = function(params, callback){
        var err = this.checkMandatory(['user_name', 'group_id'], params);
        if(err) return callback(err);

        var body = {};
        if (params.user_name != null) body.user_name = params.user_name;

        this.call('groups/' + params.group_id + '/members/', 'DELETE', body, null, function(err, data, code) {
            if (err) return callback(err);
            return callback(null, data, code);
        });
    }

}





function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
