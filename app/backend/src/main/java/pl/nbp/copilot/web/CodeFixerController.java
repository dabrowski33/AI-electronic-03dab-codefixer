package pl.nbp.copilot.web;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.nbp.copilot.dto.CodeAnalysisRequest;
import pl.nbp.copilot.dto.CodeAnalysisResponse;
import pl.nbp.copilot.model.CodeAnalysisSession;
import pl.nbp.copilot.session.CodeAnalysisSessionRepository;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/codefixer")
@CrossOrigin(origins = {"http://localhost:3001", "http://localhost:5173"})
public class CodeFixerController {

    private final CodeAnalysisSessionRepository sessionRepository;

    public CodeFixerController(CodeAnalysisSessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    @PostMapping("/sessions")
    public ResponseEntity<CodeAnalysisResponse> createSession(
            @Valid @RequestBody CodeAnalysisRequest request) {
        var session = new CodeAnalysisSession();
        session.setLanguage(request.language() != null ? request.language() : "other");
        session.setOriginalCode(request.code());
        session.setErrorTrace(request.errorTrace());
        sessionRepository.save(session);
        return ResponseEntity.ok(new CodeAnalysisResponse(session.getSessionId(), "CREATED"));
    }

    @GetMapping("/sessions/{sessionId}")
    public ResponseEntity<CodeAnalysisSession> getSession(@PathVariable String sessionId) {
        return sessionRepository.findById(sessionId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<CodeAnalysisSession>> listSessions() {
        return ResponseEntity.ok(sessionRepository.findAll());
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "ok",
            "service", "codefixer-backend",
            "version", "1.0.0"
        ));
    }
}
