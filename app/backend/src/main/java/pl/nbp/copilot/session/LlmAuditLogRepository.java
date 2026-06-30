package pl.nbp.copilot.session;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.nbp.copilot.model.LlmAuditLog;
import java.util.List;

public interface LlmAuditLogRepository extends JpaRepository<LlmAuditLog, String> {
    List<LlmAuditLog> findBySessionIdOrderByCreatedAtDesc(String sessionId);
}
