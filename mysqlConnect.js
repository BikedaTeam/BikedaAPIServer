'use strict';
var mysql = require('mysql');  //My-sql을 사용하였다.
var mybatisMapper = require('mybatis-mapper');  //매핑할 마이바티스
var format = {language: 'sql', indent: '  '};
var pool = mysql.createPool({  //커넥션 생성
  connectionLimit : 1,
  waitForConnections : true,
  host: '211.47.75.102',
  user: 'deliverylabapi',
  database: 'dbdeliverylabapi',
  password : 'deliverylabapi!!'
});

mybatisMapper.createMapper([
  './public/mapper/common.xml',
  './public/mapper/branch.xml',
]);
var query = function ( namespace, queryId, sqlParam, callback ) {
  console.log('=== Query ID : ' + namespace + "." + queryId );

  pool.getConnection( function ( err, connection ) {
    if( err ) callback( err, null );
    else {
      var sql = mybatisMapper.getStatement(namespace, queryId, sqlParam, format);
      connection.query( sql, function ( error, results ) {
        connection.release();
        callback( error, results );
      });
    }
  });
};

module.exports=query;
