package pl.nbp.copilot.dto;

import jakarta.validation.constraints.NotBlank;

public record CodeAnalysisRequest(
    String sessionId,
    @NotBlank String message,
    String code,
    String errorTrace,
    String language
) {}
