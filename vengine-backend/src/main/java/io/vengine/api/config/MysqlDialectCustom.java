package io.vengine.api.config;

import org.hibernate.dialect.MySQL57Dialect;
import org.hibernate.dialect.function.StandardSQLFunction;
import org.hibernate.type.StandardBasicTypes;

public class MysqlDialectCustom extends MySQL57Dialect {
    public MysqlDialectCustom() {
        super();

        // native function 추가 - hibernate 버그인지 등록을 안 해주면 실행을 못 함
        this.registerFunction("group_concat", new StandardSQLFunction("group_concat", StandardBasicTypes.STRING));
    }
}
