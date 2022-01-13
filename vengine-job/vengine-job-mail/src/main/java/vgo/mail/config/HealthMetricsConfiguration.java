package vgo.mail.config;

import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.boot.actuate.autoconfigure.metrics.MeterRegistryCustomizer;
import org.springframework.boot.actuate.health.HealthContributorRegistry;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.actuate.health.SimpleStatusAggregator;
import org.springframework.boot.actuate.health.Status;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.stream.Collectors;

import static java.util.Collections.emptyList;

@Configuration
public class HealthMetricsConfiguration {
    @Bean
    MeterRegistryCustomizer<MeterRegistry> healthRegistryCustomizer(HealthContributorRegistry healthRegistry) {
        return registry -> registry.gauge("health", emptyList(), healthRegistry, health -> {
            var status = aggregatedStatus(health);
            switch (status.getCode()) {
                case "UP":
                    return 1;
                case "OUT_OF_SERVICE":
                    return -1;
                case "DOWN":
                    return -2;
                case "UNKNOWN":
                default:
                    return 0;
            }
        });
    }

    private static Status aggregatedStatus(HealthContributorRegistry health) {
        var healthList = health.stream()
                .map(r -> ((HealthIndicator) r.getContributor()).getHealth(false).getStatus())
                .collect(Collectors.toSet());

        var statusAggregator = new SimpleStatusAggregator();
        return statusAggregator.getAggregateStatus(healthList);
    }
}
