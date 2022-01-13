package io.vengine.api.v1.audit.service.lmpl;

import io.vengine.api.v1.audit.service.AuditService;
import io.vengine.api.v1.user.entity.User;
import org.hibernate.envers.AuditReader;
import org.hibernate.envers.AuditReaderFactory;
import org.hibernate.envers.RevisionType;
import org.hibernate.envers.query.AuditEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Service
@Transactional
public class AuditServiceImpl implements AuditService {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<User> findRevisionsWithWhere() {
        AuditReader auditReader = AuditReaderFactory.get(entityManager);

        return auditReader.createQuery()
                .forRevisionsOfEntity(User.class, true, true)
//                .add(AuditEntity.property("lastName").eq("Diablo"))
//                .add(AuditEntity.property("lastName").hasNotChanged())  //변경안된 놈
//                .add(AuditEntity.property("firstName").hasChanged())    //변경된 놈
                .add(AuditEntity.revisionType().eq(RevisionType.MOD))
                .setFirstResult(0)
                .setMaxResults(3)
                .addOrder(AuditEntity.property("firstName").desc())
                .getResultList();
    }

    @Override
    public List<User> listUserRevisions(long id) {
        return null;

//        AuditQuery auditQuery = auditReader.createQuery()
//                .forRevisionsOfEntity(User.class, false, true)
//                .add(AuditEntity.id().eq(id));

//        return AuditQueryUtils.getAuditQueryResults(auditQuery, User.class).stream()
//                .map(x -> getCustomHistory(x))
//                .collect(Collectors.toList());
    }
}
