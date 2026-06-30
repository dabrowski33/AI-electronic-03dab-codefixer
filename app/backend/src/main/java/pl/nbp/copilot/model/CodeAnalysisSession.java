package pl.nbp.copilot.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "code_analysis_sessions")
public class CodeAnalysisSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String sessionId;

    @Column(nullable = false)
    private String language = "other";

    @Column(columnDefinition = "TEXT")
    private String originalCode;

    @Column(columnDefinition = "TEXT")
    private String errorTrace;

    @Column(columnDefinition = "TEXT")
    private String fixedCode;

    @Enumerated(EnumType.STRING)
    private FixStatus fixStatus = FixStatus.PENDING;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    private Instant updatedAt;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CodeChatMessage> messages = new ArrayList<>();

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getOriginalCode() { return originalCode; }
    public void setOriginalCode(String originalCode) { this.originalCode = originalCode; }
    public String getErrorTrace() { return errorTrace; }
    public void setErrorTrace(String errorTrace) { this.errorTrace = errorTrace; }
    public String getFixedCode() { return fixedCode; }
    public void setFixedCode(String fixedCode) { this.fixedCode = fixedCode; }
    public FixStatus getFixStatus() { return fixStatus; }
    public void setFixStatus(FixStatus fixStatus) { this.fixStatus = fixStatus; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    public List<CodeChatMessage> getMessages() { return messages; }
    public void setMessages(List<CodeChatMessage> messages) { this.messages = messages; }
}
