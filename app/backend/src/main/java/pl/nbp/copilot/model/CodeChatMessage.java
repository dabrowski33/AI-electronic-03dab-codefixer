package pl.nbp.copilot.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "code_chat_messages")
public class CodeChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id")
    private CodeAnalysisSession session;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CodeChatRole role;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public String getId() { return id; }
    public CodeAnalysisSession getSession() { return session; }
    public void setSession(CodeAnalysisSession session) { this.session = session; }
    public CodeChatRole getRole() { return role; }
    public void setRole(CodeChatRole role) { this.role = role; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Instant getCreatedAt() { return createdAt; }
}
