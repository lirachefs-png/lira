// Analytics tracking for NDC Partner conversions
// Track when users view and interact with NDC partner flights

interface NDCAnalyticsEvent {
    event: 'ndc_flight_view' | 'ndc_flight_click' | 'ndc_filter_toggle' | 'ndc_partners_page_view';
    airlineCode?: string;
    airlineName?: string;
    offerId?: string;
    timestamp: number;
    userId?: string;
}

class NDCAnalytics {
    private events: NDCAnalyticsEvent[] = [];
    private readonly STORAGE_KEY = 'alltrip_ndc_analytics';

    constructor() {
        // Load existing events from localStorage
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                try {
                    this.events = JSON.parse(stored);
                } catch (e) {
                    console.error('Failed to parse NDC analytics:', e);
                }
            }
        }
    }

    private save() {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.events));
        }
    }

    // Track when user views a flight from NDC partner in search results
    trackFlightView(airlineCode: string, airlineName: string, offerId: string) {
        const event: NDCAnalyticsEvent = {
            event: 'ndc_flight_view',
            airlineCode,
            airlineName,
            offerId,
            timestamp: Date.now(),
        };
        this.events.push(event);
        this.save();

        // Also send to console for debugging
        console.log('📊 NDC Analytics: Flight View', { airlineCode, airlineName });
    }

    // Track when user clicks on a flight from NDC partner
    trackFlightClick(airlineCode: string, airlineName: string, offerId: string) {
        const event: NDCAnalyticsEvent = {
            event: 'ndc_flight_click',
            airlineCode,
            airlineName,
            offerId,
            timestamp: Date.now(),
        };
        this.events.push(event);
        this.save();

        console.log('📊 NDC Analytics: Flight Click', { airlineCode, airlineName });
    }

    // Track when user toggles NDC filter
    trackFilterToggle(enabled: boolean) {
        const event: NDCAnalyticsEvent = {
            event: 'ndc_filter_toggle',
            timestamp: Date.now(),
        };
        this.events.push(event);
        this.save();

        console.log('📊 NDC Analytics: Filter Toggle', { enabled });
    }

    // Track when user visits /partners page
    trackPartnersPageView() {
        const event: NDCAnalyticsEvent = {
            event: 'ndc_partners_page_view',
            timestamp: Date.now(),
        };
        this.events.push(event);
        this.save();

        console.log('📊 NDC Analytics: Partners Page View');
    }

    // Get conversion stats
    getStats() {
        const stats = {
            totalFlightViews: this.events.filter(e => e.event === 'ndc_flight_view').length,
            totalFlightClicks: this.events.filter(e => e.event === 'ndc_flight_click').length,
            totalFilterToggles: this.events.filter(e => e.event === 'ndc_filter_toggle').length,
            totalPartnersPageViews: this.events.filter(e => e.event === 'ndc_partners_page_view').length,
            clickThroughRate: 0,
            byAirline: {} as Record<string, { views: number; clicks: number; ctr: number }>,
        };

        // Calculate CTR
        if (stats.totalFlightViews > 0) {
            stats.clickThroughRate = (stats.totalFlightClicks / stats.totalFlightViews) * 100;
        }

        // Group by airline
        this.events.forEach(event => {
            if (event.airlineCode && event.airlineName) {
                if (!stats.byAirline[event.airlineCode]) {
                    stats.byAirline[event.airlineCode] = { views: 0, clicks: 0, ctr: 0 };
                }

                if (event.event === 'ndc_flight_view') {
                    stats.byAirline[event.airlineCode].views++;
                } else if (event.event === 'ndc_flight_click') {
                    stats.byAirline[event.airlineCode].clicks++;
                }
            }
        });

        // Calculate CTR per airline
        Object.keys(stats.byAirline).forEach(code => {
            const airline = stats.byAirline[code];
            if (airline.views > 0) {
                airline.ctr = (airline.clicks / airline.views) * 100;
            }
        });

        return stats;
    }

    // Export events for external analytics (Google Analytics, etc.)
    exportEvents() {
        return this.events;
    }

    // Clear all events (for testing or privacy)
    clear() {
        this.events = [];
        this.save();
    }
}

// Singleton instance
export const ndcAnalytics = new NDCAnalytics();

// Helper hook for React components
export function useNDCAnalytics() {
    return {
        trackFlightView: ndcAnalytics.trackFlightView.bind(ndcAnalytics),
        trackFlightClick: ndcAnalytics.trackFlightClick.bind(ndcAnalytics),
        trackFilterToggle: ndcAnalytics.trackFilterToggle.bind(ndcAnalytics),
        trackPartnersPageView: ndcAnalytics.trackPartnersPageView.bind(ndcAnalytics),
        getStats: ndcAnalytics.getStats.bind(ndcAnalytics),
    };
}
