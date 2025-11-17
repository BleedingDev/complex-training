*** Settings ***
Documentation     Configuration and shared settings for E2E tests
Library           Browser


*** Variables ***
# Environment URLs
${FRONTEND_URL}         http://localhost:4200
${API_URL}              http://localhost:8000

# Browser settings
${BROWSER}              chromium
${HEADLESS}             ${False}
${SLOW_MO}              0.0

# Timeouts (in seconds)
${DEFAULT_TIMEOUT}      10s
${LONG_TIMEOUT}         30s

# Test data
${VALID_SITE_NAME}      Test Site E2E
${VALID_LOCATION}       Prague, Czech Republic
${VALID_CAPACITY}       1500
${VALID_STATUS}         ACTIVE

# Selectors - centralized and unique data-testid attributes
# Page selectors
${SITES_LIST_SELECTOR}           css=[data-testid="sites-list"]
${SITE_ITEM_SELECTOR}            css=[data-testid="site-item"]

# Button selectors
${ADD_SITE_BUTTON}               css=[data-testid="add-site-button"]
${SUBMIT_BUTTON}                 css=[data-testid="submit-button"]
${CANCEL_BUTTON}                 css=[data-testid="cancel-button"]

# Form selectors
${SITE_FORM_SELECTOR}            css=[data-testid="site-form"]
${NAME_INPUT}                    css=[data-testid="site-name-input"]
${LOCATION_INPUT}                css=[data-testid="site-location-input"]
${CAPACITY_INPUT}                css=[data-testid="site-capacity-input"]
${STATUS_SELECT}                 css=[data-testid="site-status-select"]

# Message selectors
${ERROR_MESSAGE_SELECTOR}        css=[data-testid="error-message"]
${SUCCESS_MESSAGE_SELECTOR}      css=[data-testid="success-message"]

# Detail view selectors
${SITE_DETAIL_SELECTOR}          css=[data-testid="site-detail-card"]
