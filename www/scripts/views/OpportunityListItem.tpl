<a href="#">
    <div class="opportunity-list-item">
        <div class="opportunity-name-label"><%= Name %><% if (Account && Account.Name) { %> | <%= Account.Name %><% } %></div>

        <div class="opportunity-chart">

            <div class="revenue-bar" style="width: <%= 100 * ExpectedRevenue / MaxExpectedRevenue %>%"></div>
            <span class="revenue-bar-label">$<%= ExpectedRevenue ? ExpectedRevenue : 0 %></span>

            <div class="events-bar"
                 style="width: <%= 100 * EventsDurationInHours * RevenuePerHour / MaxExpectedRevenue %>%"></div>
            <span class="events-bar-label"><%= EventsDurationInHours %> hours - $<%= EventsDurationInHours * RevenuePerHour %></span>

        </div>
    </div>
    <p class="ui-li-aside"><%= CloseDate %></p>
</a>
