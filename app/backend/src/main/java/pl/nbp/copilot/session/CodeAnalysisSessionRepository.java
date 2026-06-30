package pl.nbp.copilot.session;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.nbp.copilot.model.CodeAnalysisSession;

public interface CodeAnalysisSessionRepository extends JpaRepository<CodeAnalysisSession, String> {
}
