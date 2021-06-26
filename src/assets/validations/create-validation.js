import Joi from 'joi';

const abortEarly = false;

export const create = Joi.object()
  .keys({
    <% attributes.forEach(function(attribute, index) { %>
      <%= attribute.fieldName %>: Joi.<%=attribute.dataType%>()<%=`${attribute.notNull ? '.required(),' : ','}`%>
    <% }) %>
  })
  .options({ abortEarly });

export const update = Joi.object()
  .keys({
    <% attributes.forEach(function(attribute, index) { %>
      <%= attribute.fieldName %>: Joi.<%=attribute.dataType%>(),
    <% }) %>
  })
  .options({ abortEarly });
