<li>
    <h3><strong>Duration:</strong> <%= DurationInMinutes %> minutes</h3>

    <% if (Who) { %><p><strong><%= Who.Type %>:</strong> <%= Who.Name %></p><% } %>

    <p><strong>Start:</strong> <%= StartDateTime %></p>

    <p><strong>End:</strong> <%= EndDateTime %></p>

    <% if (Description) { %><p><strong>Description:</strong> <%= Description %></p><% } %>

    <span class="ui-li-aside"><%= Subject %></span>
</li>