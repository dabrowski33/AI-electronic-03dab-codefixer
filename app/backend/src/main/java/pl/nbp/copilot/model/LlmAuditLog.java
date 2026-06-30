package pl.nbp.copilot.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "llm_audit_logs")
public class LlmAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String sessionId;
    private String provider;
    private String model;
    private boolean success;
    private Integer httpStatus;

    @Column(columnDefinition = "TEXT")
    private String errorMessage;

    private Long latencyMs;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public String getId() { return id; }
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public Integer getHttpStatus() { return httpStatus; }
    public void setHttpStatus(Integer httpStatus) { this.httpStatus = httpStatus; }
    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
    public Long getLatencyMs() { return latencyMs; }
    public void setLatencyMs(Long latencyMs) { this.latencyMs = latencyMs; }
    public Instant getCreatedAt() { return createdAt; }
}
