/**
 * Created by Jose Luis on 14/01/2015.
 */

Ext.define('Aircraft', {
    extend: 'Ext.data.Model',
    fields: [
        'name',
        'id',
        { name: 'active', type: 'bool' }
    ]
});

Ext.create('Ext.data.Store', {
    storeId:'simpsonsStore',
    fields:['name', 'email', 'phone'],
    data: [
        {"name":"Lisa", "email":"lisa@simpsons.com", "phone":"555-111-1224"},
        {"name":"Bart", "email":"bart@simpsons.com", "phone":"555-222-1234"},
        {"name":"Homer", "email":"homer@simpsons.com", "phone":"555-222-1244"},
        {"name":"Marge", "email":"marge@simpsons.com", "phone":"555-222-1254"}
    ]
});

