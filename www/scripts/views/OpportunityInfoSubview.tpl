<h2><%= Name %></h2>
<% if (Account) { %><h3><%= Account.Name %></h3><% } %>

<p>
    <i><%= Description ? Description : 'Description...' %></i>
</p>

<p>
    <strong>Expected Revenue:</strong> $<%= ExpectedRevenue ? ExpectedRevenue : 0 %>
</p>

<p>
    <strong>Close Date:</strong> <%= CloseDate ? CloseDate : 'N/A' %>
</p>

<p>
    <strong>Stage:</strong> <%= StageName ? StageName : '' %>
</p>

<p>
    <strong>Lead Source:</strong> <%= LeadSource ? LeadSource : 'N/A' %>
</p>